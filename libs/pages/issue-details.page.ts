import { expect, Locator, Page } from '@playwright/test'
import Logger from '../common/logger'

export class IssueDetailsPage {
    page: Page
    logger: Logger
    title: Locator
    status: Locator
    issueNumber: Locator
    closeBtn: Locator
    timelineCloseMessage: Locator
    constructor(page: Page, logger: Logger) {
        this.page = page
        this.logger = logger
        this.title = this.page.getByTestId('issue-title')
        this.status = this.page.getByTestId('issue-metadata-fixed').getByTestId('header-state')
        this.issueNumber = this.page.locator('div[data-component="TitleArea"] span')
        this.closeBtn = this.page.getByText('Close Issue')
        this.timelineCloseMessage = this.page.getByTestId(/timeline-row-border-.*/)
    }
    async getIssueNumber(): Promise<number> {
        const issueNb = await this.issueNumber.innerText()
        return parseInt(issueNb.replace('#',''))
    }
    async closeIssue(): Promise<void> {
        await this.closeBtn.click()
        await expect(this.timelineCloseMessage).toBeVisible()
    }
}