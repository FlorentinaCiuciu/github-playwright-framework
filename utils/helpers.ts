import { APIResponse, Locator, Page, expect } from "@playwright/test"
import Ajv from 'ajv'

export const randomNumber = (max: number = 10000000): number => Math.floor(Math.random() * max)

export const parseApiResponse = async (response: APIResponse) =>  { return { status: response.status(), json: await response.json() }}

// Screenshot validator - compare with element baseline screenshot
export const validateDisplayedImage = async (elementLocator: Locator, page: Page): Promise<void> => {
    await expect(elementLocator).toBeVisible()
    const clipDims = await elementLocator.boundingBox()
    await expect.soft(page).toHaveScreenshot({
      clip: clipDims || undefined,
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    })
  } 
// API response schema validator
export const validateSchema = (schema, body) =>  {
    const ajv = new Ajv({strictTuples: true})
    const validate = ajv.compile(schema)
    const valid = validate(body)
    const { errors } = validate
    return { valid, errors }
  }