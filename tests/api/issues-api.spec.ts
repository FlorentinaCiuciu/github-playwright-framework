import { test } from '../../fixtures/base.fixture'
import { expect } from '@playwright/test'
import { validateSchema } from '../../utils/helpers'
import  issuesListSchema  from '../../test-data/api-schemas/issues-list.json'
import  issueCreatedSchema  from '../../test-data/api-schemas/issue-create.json'
import issueDetailsSchema from '../../test-data/api-schemas/issue-details.json'
import issueUpdatedSchema from '../../test-data/api-schemas/issue-update.json'
import { invalidIssueBody, validIssueBody } from '../../test-data/data/issue-data'
import { IssueStates } from '../../libs/common/enums'
import { createIssueAPIErrorMessages } from '../../test-data/data/text-resources'

test.describe('Issue creation and update', async () => {
  let newIssueId: number
  let createResponse: { status:number, json:any }
  test.beforeEach(async({issuesApi, logger}) => {  
    // Create a new issue
    createResponse = await issuesApi.createIssue(validIssueBody)
    newIssueId = createResponse.json.number
    logger.log(`Created issue id: ${newIssueId}`)
  })
  test('@smoke API - Validate issue creation', async ({ issuesApi }) => {
    // Validate api response status and body
    expect.soft(createResponse.status).toBe(201)
    expect.soft(validateSchema(issueCreatedSchema, createResponse.json).valid).toBe(true)

    // Get issue details
    const issueDetailsResponse = await issuesApi.getIssueDetails(newIssueId)
    // Validate api response status and body
    expect.soft(issueDetailsResponse.status).toBe(200)
    expect.soft(validateSchema(issueDetailsSchema, issueDetailsResponse.json).valid).toBe(true)
    
    // Validate issue was created with right title and body
    expect.soft(issueDetailsResponse.json.title).toEqual(validIssueBody.title)
    expect.soft(issueDetailsResponse.json.body).toEqual(validIssueBody.body)

  })
  test('@smoke API - Validate issue state update', async ({ issuesApi }) => {
    const expectedIssueState = IssueStates.CLOSED.toLowerCase()
    // Update issue to state = closed
    const updateResponse = await issuesApi.updateIssue(newIssueId, { state: expectedIssueState})
    
    // Validate api response status and body
    expect.soft(updateResponse.status).toBe(200)
    expect.soft(validateSchema(issueUpdatedSchema, updateResponse.json).valid).toBe(true)
    expect.soft(updateResponse.json.state).toEqual(expectedIssueState)

    // Get issue details
    const issueDetailsResponse = await issuesApi.getIssueDetails(newIssueId)
    // Validate status was updated
    expect.soft(issueDetailsResponse.status).toBe(200)
    expect.soft(issueDetailsResponse.json.state).toEqual(expectedIssueState)
  })
})

test('@regression API - Validate issue list endpoint', async({issuesApi, logger}) => {
// Get all issues
const issuesListResponse = await issuesApi.getIssuesList()
logger.log(`Issues list number: ${issuesListResponse.json.length}`)
// Validate api response status and body
expect.soft(issuesListResponse.status).toBe(200)
expect.soft(validateSchema(issuesListSchema, issuesListResponse.json).valid).toBe(true)
})

const testCases = [
  { usecase: 'Missing required title',
    testData: invalidIssueBody.noTitle,
    expectedStatus: 422,
    expectedMessage: createIssueAPIErrorMessages.noTitle
 },
 {  usecase: 'Invalid assignee in payload',
    testData: invalidIssueBody.invalidAssignee,
    expectedStatus: 422,
    expectedMessage: createIssueAPIErrorMessages.invalidAssignee
}]
testCases.forEach(({usecase, testData, expectedStatus, expectedMessage}) => {
  test(`@regression API - Issue creation payload validations - ${usecase}`, async({issuesApi}) => {
    const createResponse = await issuesApi.createIssue(testData)
    expect.soft(createResponse.status).toBe(expectedStatus)
    expect.soft(createResponse.json.message).toBe(expectedMessage)
  })
})

test(`@regression API - Issue creation - invalid endpoint path`, async({issuesApi}) => {
  issuesApi.endpointPath +='/test'
  const createResponse = await issuesApi.createIssue({title: 'test test'})
  expect.soft(createResponse.status).toBe(404)
  expect.soft(createResponse.json.message).toBe(createIssueAPIErrorMessages.invalidPath)
})