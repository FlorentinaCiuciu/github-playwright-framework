import  base  from '@playwright/test'
import { IssuesEndpoint } from '../libs/apis/issues.api'
import { IssuesPage } from '../libs/pages/issues.page'
import Logger from '../libs/common/logger'
import { LoginPage } from '../libs/pages/login.page'
type customFixtures = {
    logger: Logger
    loginPage: LoginPage
    issuesApi: IssuesEndpoint,
    issuesPage: IssuesPage,
}
const test = base.extend<customFixtures>({
logger: async ({}, use, testInfo) => {
    use(new Logger(testInfo.title))
  },
loginPage: async({page, logger}, use) => {
     const loginPage = new LoginPage(page, logger)
     await use(loginPage)
},
issuesApi: async({playwright}, use) => {
    const apiRequest = await playwright.request.newContext({
        extraHTTPHeaders: {
          Authorization: `token ${process.env.TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
       })
    const issues = new IssuesEndpoint(apiRequest)  
    await use(issues)
},
issuesPage: async({page, logger}, use) => {
    const issuesPage = new IssuesPage(page, logger)
    await issuesPage.goToIssues()
    
    await use(issuesPage)
},
})

export { test }
