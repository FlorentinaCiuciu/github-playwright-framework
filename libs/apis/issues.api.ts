import { APIRequestContext } from "playwright-core"
import { API_BASE_URL } from "../../playwright.config"
import { parseApiResponse } from "../../utils/helpers"

export class IssuesEndpoint {
    request: APIRequestContext
    endpointPath: string
    constructor(apiRequest: APIRequestContext) {
        this.request = apiRequest
        this.endpointPath = `${API_BASE_URL}/issues`
    }
    // Get list of issues
    async getIssuesList() {
        const response = await this.request.get(this.endpointPath)
        return await parseApiResponse(response)
    }
    // Get issue details
    async getIssueDetails(issueNumber: number) {
        const response = await this.request.get(`${this.endpointPath}/${issueNumber}`)
        return await parseApiResponse(response)
    }
    // Create new issue
    async createIssue(payload) {
        const response = await this.request.post(this.endpointPath, { data: payload })
        return await parseApiResponse(response)
    }
    // Update issue
    async updateIssue( issueNumber: number, payload) {
        const response = await this.request.post(`${this.endpointPath}/${issueNumber}`, { data: payload })
        return await parseApiResponse(response)
    }
}