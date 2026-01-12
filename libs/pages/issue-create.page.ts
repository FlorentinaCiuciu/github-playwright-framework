import { Locator, Page } from '@playwright/test'
import { IssueDetailsPage } from './issue-details.page'
import Logger from '../common/logger'

export class IssueCreatePage {
    page: Page
    logger: Logger
    createIssuesContainer: Locator
    titleInput: Locator
    bodyInput: Locator
    createBtn: Locator
    titleValidation: Locator
    constructor(page: Page, logger: Logger) {
        this.page = page
        this.logger = logger
        this.createIssuesContainer = this.page.getByTestId('issue-create-pane-container')
        this.titleInput = this.page.getByPlaceholder('Title')
        this.bodyInput = this.page.getByPlaceholder('Type your description here…')
        this.createBtn = this.page.getByTestId('create-issue-button')
        this.titleValidation = this.page.locator('#title-validation')
    }
    async createIssue(issueDetails): Promise<IssueDetailsPage> {
        if(issueDetails.title) {
            await this.titleInput.fill(issueDetails.title)
        }
        if(issueDetails.body) {
            await this.bodyInput.fill(issueDetails.body)
        }
        await this.createBtn.click()
        return new IssueDetailsPage(this.page, this.logger)
    }
}