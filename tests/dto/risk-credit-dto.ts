export class riskCreditDto {
  income: number | null
  debt: number | null
  age: number | null
  employed: boolean
  loanAmount: number | null
  loanPeriod: number | null

  constructor(
    income: number,
    debt: number,
    age: number,
    employed: boolean,
    loanAmount: number,
    loanPeriod: number,
  ) {
    this.income = income
    this.debt = debt
    this.age = age
    this.employed = employed
    this.loanAmount = loanAmount
    this.loanPeriod = loanPeriod
  }
}
