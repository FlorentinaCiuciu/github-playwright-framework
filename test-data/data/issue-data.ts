import { randomNumber } from "../../utils/helpers";

export const validIssueBody = {
      title: `Found a bug - ${randomNumber()}`,
      body: 'This is the issue body.',
    }

export const invalidIssueBody = {
    noTitle: { body: 'issue description'},
    invalidAssignee: {
      "title": "Found a bug",
      "assignees": 123
  }
    }
