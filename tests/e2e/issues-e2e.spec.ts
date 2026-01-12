import { expect } from '@playwright/test';
import { test } from '../../fixtures/base.fixture'
import { IssueCreatePage } from '../../libs/pages/issue-create.page';
import { IssueDetailsPage } from '../../libs/pages/issue-details.page';
import { invalidIssueBody, validIssueBody } from '../../test-data/data/issue-data';
import { IssueStates } from '../../libs/common/enums';
import { createIssueUIErrorMessages } from '../../test-data/data/text-resources';

test.describe('Issue creation and update', async () => {
  let issueDetailsPage: IssueDetailsPage , issueCreatePage: IssueCreatePage
  test.beforeEach(async({issuesPage}) => {  
    // Create a new issue
     issueCreatePage = await issuesPage.openCreateIssuePage()
     issueDetailsPage = await issueCreatePage.createIssue(validIssueBody)
    })
   
  test('@smoke E2E - Validate issue creation', async ({ issuesPage}) => {
    await expect(issueCreatePage.createBtn).toBeVisible({ visible: false})
    // Verify issue was created
    expect.soft(await issueDetailsPage.title.innerText()).toBe(validIssueBody.title)
    expect.soft(await issueDetailsPage.status.innerText()).toBe(IssueStates.OPEN)
  
    await issuesPage.goToIssues()
    // Verify issue appears in Issues List
    await expect.soft(issuesPage.issueWithTitle(validIssueBody.title)).toBeVisible()
  })

  test('@smoke E2E - Validate issue state update', async ({ issuesPage, issuesApi }) => {
    await issuesPage.goToIssues()
    // Open issue and change state to Close
    issueDetailsPage = await issuesPage.openIssueDetails(validIssueBody.title)
    await issueDetailsPage.closeIssue()

    // Verify issue was Closed
    expect.soft(await issueDetailsPage.title.innerText()).toBe(validIssueBody.title)
    expect.soft(await issueDetailsPage.status.innerText()).toBe(IssueStates.CLOSED)
    const issueId = await issueDetailsPage.getIssueNumber()

    const issueDetailsResponse = await issuesApi.getIssueDetails(issueId)
    // Validate via API the status was updated
    expect.soft(issueDetailsResponse.status).toBe(200)
    expect.soft(issueDetailsResponse.json.state).toEqual(IssueStates.CLOSED.toLowerCase())

  })
})
test('@regression E2E - Validate issue creation without title', async({ issuesPage, issuesApi }) => {
  const issueCreatePage = await issuesPage.openCreateIssuePage()
  await issueCreatePage.createIssue(invalidIssueBody.noTitle)
  
  // Verify title validation is displayed and has the right text
  await expect.soft(issueCreatePage.createBtn).toBeVisible()
  expect.soft(await issueCreatePage.titleValidation.innerText()).toBe(createIssueUIErrorMessages.noTitle)
})