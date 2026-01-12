import { expect } from '@playwright/test'
import { test } from '../fixtures/base.fixture'
import { STORAGE_STATE } from '../playwright.config'

test('Login to github', async ({ loginPage }) => {
    await loginPage.page.goto('/')
    await loginPage.loginWithUser(process.env.USERNAME, process.env.PASSWORD)
    expect(await loginPage.headerTitle.innerText()).toBe('Dashboard')

    await loginPage.page.context().storageState({ path: STORAGE_STATE})
})