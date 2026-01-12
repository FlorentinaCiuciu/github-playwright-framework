import { defineConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv"
import path from 'path';
dotenv.config({ path: __dirname+'/config/.env' })

export const BASE_URL = `https://github.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}`
export const API_BASE_URL = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}`
export const STORAGE_STATE = path.join(__dirname,'.auth/user.json')
export const VERBOSE = process.env['VERBOSE'] === 'true' || false

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : 5,
  snapshotPathTemplate: 'test-data/snapshots/{testFilePath}/{arg}-{projectName}{ext}',
  reporter: [
    ['list', { printSteps: true }], 
    ['html', { open: 'never',  outputFolder: './reports/playwright-report' }], 
    ['allure-playwright',
    { detail: true, resultsDir: './reports/allure-results', suiteTitle: false },
  ],
    ['junit', { outputFile: './reports/results.xml' }]
  ],
  timeout: 100000,
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    headless: process.env.CI ? true: false, // use false for local debug
  },
  projects: [
    {
      name: 'setup',
      testDir: './setup',
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: 'https://github.com/'
      },
      
    },
    {
      name: 'e2e-tests-chrome',
      testMatch: ['/e2e/**/*.spec.ts', '/visuals/**/*.spec.ts'],
      use: { 
        ...devices['Desktop Chrome'], 
        baseURL: BASE_URL,
        storageState: STORAGE_STATE 
      },
      dependencies: ['setup']
    },
    {
      name: 'e2e-tests-firefox',
      testMatch: ['/e2e/**/*.spec.ts', '/visuals/**/*.spec.ts'],
      use: { 
        ...devices['Desktop Firefox'], 
        baseURL: BASE_URL,
        storageState: STORAGE_STATE 
      },
      dependencies: ['setup']
    },
    {
      name: 'api-tests',
      testMatch: '/api/**/*.spec.ts',
      use: { 
        baseURL: API_BASE_URL
      },
    },
  ],
});
