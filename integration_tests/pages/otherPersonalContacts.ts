import Page, { PageElement } from './page'

export default class OtherPersonalContacts extends Page {
  constructor() {
    super(' other personal contacts')
  }

  courtRegisterLink = (): PageElement => cy.get('[href="/court-register"]')
}
