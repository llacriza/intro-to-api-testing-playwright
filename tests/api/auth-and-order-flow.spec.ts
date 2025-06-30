import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from '../dto/login-dto'
import { OrderDto } from '../dto/order-dto'
import { APIResponse } from 'playwright'
import { ApiClient } from './api-client'

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




test('Successful finding order by ID without ApiClient ', async ({ request }) => {
  const requestBody = LoginDto.createLoginWithCorrectData()
  const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
    data: requestBody,
  })
  expect.soft(loginResponse.ok()).toBeTruthy()
  const jwt = await loginResponse.text()
  const createOrderResponse = await request.post(`${serviceURL}${orderPath}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: {
      status: 'OPEN',
      courierId: 8,
      customerName: 'Glafira',
      customerPhone: '58392876',
      comment: 'without api',
      id: 0,
    },
  })
  expect.soft(createOrderResponse.ok()).toBeTruthy()
  const { id: orderId } = await createOrderResponse.json()
  const getOrderResponse: APIResponse = await request.get(`${serviceURL}${orderPath}/${orderId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  expect.soft(getOrderResponse.ok()).toBeTruthy()
  const orderData = await getOrderResponse.json()
  console.log('Order by ID:', orderData)
  expect(orderData.id).toBe(orderId)
})

test('Successful deleting order by ID without ApiClient ', async ({ request }) => {
  const requestBody = LoginDto.createLoginWithCorrectData()
  const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
    data: requestBody,
  })
  expect.soft(loginResponse.ok()).toBeTruthy()
  const jwt = await loginResponse.text()
  const createOrderResponse = await request.post(`${serviceURL}${orderPath}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: {
      status: 'OPEN',
      courierId: 8,
      customerName: 'Glafira',
      customerPhone: '58392876',
      comment: 'without api',
      id: 0,
    },
  })
  expect.soft(createOrderResponse.ok()).toBeTruthy()
  const { id: orderId } = await createOrderResponse.json()
  expect.soft(orderId).toBeTruthy()
  const deleteResponse = await request.delete(`${serviceURL}${orderPath}/${orderId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  const getOrderResponse: APIResponse = await request.get(`${serviceURL}${orderPath}/${orderId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  expect.soft(deleteResponse.status()).toBe(StatusCodes.OK);
  expect.soft(getOrderResponse.status()).toBe(StatusCodes.OK);

})

test('Successful order with ApiClient', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})

test('Successful get order via client id with ApiClient', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})

test('Delete order by ID using ApiClient', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  const deleteResponse = await apiClient.deleteOrder(orderId)
  expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
  const getResponse = await apiClient.deleteOrder(orderId)
  expect.soft(getResponse.status()).toBe(StatusCodes.OK)
})
