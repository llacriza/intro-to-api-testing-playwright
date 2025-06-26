import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'
import { APIResponse } from 'playwright'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

// JWT pattern in the form of a regular expression
const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and verify auth token', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    console.log('requestBody:', requestBody)
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    const responseBody = await response.text()

    console.log('response code:', response.status())
    console.log('response body:', responseBody)
    expect(response.status()).toBe(StatusCodes.OK)
    expect(jwtPattern.test(responseBody)).toBeTruthy()
  })

  test('login with incorrect data and verify response code 401', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()
    console.log('requestBody:', requestBody)
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    const responseBody = await response.text()

    console.log('response code:', response.status())
    console.log('response body:', responseBody)
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody).toBe('')
  })

  test('login and create order', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    const jwt = await response.text()
    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const orderResponseBody = await orderResponse.json()
    console.log('orderResponse status:', orderResponse.status())
    console.log('orderResponse:', orderResponseBody)
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(orderResponseBody.status).toBe('OPEN')
    expect.soft(orderResponseBody.id).toBeDefined()
  })
})

test('Return a valid body JWT token after login', async ({ request }) => {
  const requestBody: LoginDto = LoginDto.createLoginWithCorrectData()
  const response: APIResponse = await request.post(`${serviceURL}${loginPath}`, {
    data: requestBody,
  })
  const jwt: string = await response.text()
  const jwtRegex = /^eyJhb[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
  console.log('JWT:', jwt)
  expect.soft(jwt).toMatch(jwtRegex)
  expect.soft(response.status()).toBe(StatusCodes.OK)
})

test('Return code 405 for wrong HTTP method on login', async ({ request }) => {
  const response: APIResponse = await request.get(`${serviceURL}${loginPath}`)
  console.log('Status for wrong HTTP method:', response.status())

  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

test('Return code 400 for invalid login request body', async ({ request }) => {
  const response: APIResponse = await request.post(`${serviceURL}${loginPath}`)
  console.log('Status for invalid body:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
