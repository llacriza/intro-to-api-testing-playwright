import { expect, test } from '@playwright/test'
import { ApiClient } from './api/api-client'
import { StatusCodes } from 'http-status-codes'

test('Successful login and create order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})
test('Successful login and delete unexisting order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = 467480
  console.log('orderId:', orderId)
  await apiClient.deleteOrder(orderId)
  const response = await apiClient.deleteOrder(orderId)
  const responseBody = await response.ok()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody).toBeTruthy()
})
