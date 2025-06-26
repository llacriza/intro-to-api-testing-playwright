export class OrderDto {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number

  constructor(
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number,
    status: string,
  ) {
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
    this.status = status
    this.courierId = courierId
  }
  static createOrderWithRandomData(): OrderDto {
    return new OrderDto(
      Math.floor(Math.random() * 100),
      'John Smith',
      'test comment',
      '1',
      Math.floor(Math.random() * 100),
      'OPEN',
    )
  }
  static createOrderWithoutId(): Omit<OrderDto, 'id'> {
    return new OrderDto(
      Math.floor(Math.random() * 100),
      'John Smith',
      'test comment',
      '1',
      Math.floor(Math.random() * 100),
      'OPEN',
    )
  }
}
