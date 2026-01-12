import { Locator, Page } from '@playwright/test'
import Logger from '../common/logger'

export class LoginPage {
    page: Page
    logger: Logger
    signInLink: Locator
    headerTitle: Locator
    username: Locator
    password: Locator
    signInBtn: Locator
    constructor(page: Page, logger: Logger) {
        this.page = page
        this.logger = logger
        this.signInLink = this.page.getByRole('link', { name: 'Sign in' }) // TODO: this should be on a landing page class
        this.headerTitle = this.page.getByTestId('top-nav-center').getByRole('link', { name: 'Dashboard' }) // TODO: this should be on a header page object
        this.username = this.page.locator('#login_field')
        this.password = this.page.locator('#password')
        this.signInBtn = this.page.locator('input[value="Sign in"]')
    }
    
    async loginWithUser(username: string, password: string): Promise<void> {
        await this.signInLink.click()  
        await this.username.fill(username)
        await this.password.fill(password)
        await this.signInBtn.click()
        
    }
}