import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { riskCreditDto } from './dto/risk-credit-dto'

test('Risk decision negative very high risk - code 200', async ({request}) => {
  const requestBody = new riskCreditDto(100, 0, 17, true, 1000, 12)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.riskLevel).toBe('Very High Risk')
  expect.soft(responseBody.riskDecision).toBe(
    'negative',
  )
})
test('Risk decision positive low risk - code 200', async ({request}) => {
  const requestBody = new riskCreditDto(2000, 0, 31, true, 500, 12)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.riskLevel).toBe('Low Risk')
  expect.soft(responseBody.riskDecision).toBe(
    'positive',
  )
})
test('Risk decision positive medium risk - code 200', async ({request}) => {
  const requestBody = new riskCreditDto(10000, 0, 50, true, 500, 6)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskDecision).toBe(
    'positive',
  )
})
test('Risk decision all data 0 - code 400', async ({request}) => {
  const requestBody = new riskCreditDto(0,0,0,true,0,0,)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Risk decision data income,debt 0 - code 400', async ({request}) => {
  const requestBody = new riskCreditDto(0,0,50,true,1000,12,)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Risk decision positive data employed false - code 200', async ({request}) => {
  const requestBody = new riskCreditDto(3000,0,50,false,1000,12,)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskDecision).toBe(
    'positive',
  )
})
test('Risk decision positive - unknown risk - code 200', async ({request}) => {
  const requestBody = new riskCreditDto(1500,5,30,true,1000,2,)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.riskLevel).toBe('Unknown Risk')
  expect.soft(responseBody.riskDecision).toBe(
    'positive',
  )
})
test('Risk decision error link path -  code 405', async ({request}) => {
  const requestBody = new riskCreditDto(2000,0,18,false,10,36,)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})
test('Risk decision negative loan is 0 -  code 400', async ({request}) => {
  const requestBody = new riskCreditDto(1000,0,8,true,100,0,)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Risk decision put request -  code 404', async ({request}) => {
  const requestBody = new riskCreditDto(1000,0,8,true,100,0,)
  const response = await request.put(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision/loan-calk',
    {
      data: requestBody,
    },
  )
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.NOT_FOUND)
})