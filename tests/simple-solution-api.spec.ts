import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

test('get order with correct id should receive code 200', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  expect(response.status()).toBe(200)
})

test('post order with correct data should receive code 201', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
})
test('get order with orderId 0 should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  const responseBody = await response.json()

  console.log(await response.json())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  console.log('check message')
  expect.soft(responseBody.message).toBe('getById.id: must be greater than or equal to 1')
})

import { OrderDto } from './dto/order-dto'
test('post order with correct data dto should receive code 201', async ({ request }) => {
  const requestBody = OrderDto.createOrderWithRandomData()
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  console.log('response status:', response.status())
  console.log('request body:', requestBody)
  expect(response.status()).toBe(StatusCodes.OK)
})

test('get order with orderID 0 should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('get order with orderID null', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/')
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('get order with orderID 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/test')
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

// PUT
test('Put request with correct data - code 200', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'Megan',
    customerPhone: '89054',
    comment: 'string',
    id: 187,
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/10', {
    data: requestBody,
    headers: {
      api_key: '1234567890123456',
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(200)
})
test('Put order request with incorrect data - code 400', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'Gorki',
    customerPhone: '637281',
    comment: 'string',
    id: 101010,
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/101010', {
    data: requestBody,
    headers: {
      api_key: '1234567890123456',
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(400)
})

//DELETE
test('Delete order request with correct - code 204', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/9', {
    headers: {
      api_key: '1234567890123456',
      accept: '*/*',
    },
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(204)
})
test('Delete order request with incorrect data - code 400', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/101010', {
    headers: {
      api_key: '1234567890123456',
      accept: '*/*',
    },
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(400)
})
//GET
test('Get order request with correct id should receive code 200', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/10')
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(200)
})
test('Get order request with incorrect id should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/101010')
  expect(response.status()).toBe(400)
})
