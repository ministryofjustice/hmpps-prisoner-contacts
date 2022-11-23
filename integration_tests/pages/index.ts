import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('This site is under construction...')
  }

  courtRegisterLink = (): PageElement => cy.get('[href="/court-register"]')
}
