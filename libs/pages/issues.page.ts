import { Locator, Page, expect } from '@playwright/test'
import { BASE_URL } from '../../playwright.config'
import { IssueDetailsPage } from './issue-details.page'
import { IssueCreatePage } from './issue-create.page'
import Logger from '../common/logger'

export class IssuesPage {
    page: Page
    logger: Logger
    newIssueBtn: Locator
    issueWithTitle: (title: string) => Locator
    constructor(page: Page, logger: Logger) {
        this.page = page
        this.logger = logger
        this.newIssueBtn = this.page.getByText('New issue')
        this.issueWithTitle = (title: string) => page.getByText(title)
    }
    
    async goToIssues(): Promise<void> {
        await this.page.goto(`${BASE_URL}/issues`)
    }

    async openCreateIssuePage(): Promise<IssueCreatePage> {
        await this.newIssueBtn.click()
        return new IssueCreatePage(this.page, this.logger)
    }

    async openIssueDetails(issueTitle: string): Promise<IssueDetailsPage> {
       const issue = this.issueWithTitle(issueTitle)
       await expect(issue).toBeVisible({timeout: 10000})
       await issue.click()
       
       return new IssueDetailsPage(this.page, this.logger)
    }
}