import { test } from '../../fixtures/base.fixture'
import { validateDisplayedImage } from '../../utils/helpers'
test.describe('Issues page - visual validations', async () => {   
  test('@regression Validate create issue page display', async ({ issuesPage}) => {
    // Create a new issue
     const issueCreatePage = await issuesPage.openCreateIssuePage()

     // Validate create issue page display
    await validateDisplayedImage(issueCreatePage.createIssuesContainer, issueCreatePage.page)
  })
})