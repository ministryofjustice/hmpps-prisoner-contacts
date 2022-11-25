import Page from '../pages/page'
import IndexPage from '../pages/index'
import OtherPersonalContacts from '../pages/otherPersonalContacts'
import { Prisoner } from '../../server/services/prisonerSearchService'
import {
  PrisonApiAddress,
  PrisonApiContact,
  PrisonApiEmail,
  PrisonApiTelephone,
} from '../../server/services/nomisPrisonerService'

const contactPhones: PrisonApiTelephone[] = [
  { number: '07711333444', type: 'MOB' },
  { number: '011333444', type: 'BUS', ext: '777' },
]
const addressPhones: PrisonApiTelephone[] = [{ number: '0115 9456789', type: 'HOME' }]

const contactEmails: PrisonApiEmail[] = [{ email: 'email@thecontact.com' }]

const homePrimary: PrisonApiAddress = {
  addressType: 'HOME',
  flat: 'A',
  premise: '13',
  street: 'High Street',
  town: 'Ulverston',
  postalCode: 'LS1 AAA',
  county: 'West Yorkshire',
  country: 'England',
  primary: true,
  noFixedAddress: false,
  startDate: '2020-05-01',
  phones: addressPhones,
}

const addresses1: PrisonApiAddress[] = [homePrimary]

const defaultContact: PrisonApiContact = {
  firstName: 'Steve',
  lastName: 'Jobs',
  contactType: 'S',
  contactTypeDescription: 'Social',
  relationshipCode: 'BRO',
  relationshipDescription: 'Brother',
  emergencyContact: false,
  nextOfKin: false,
  personId: 112,
  active: true,
  approvedVisitor: true,
  bookingId: 123,
  emails: contactEmails,
  phones: contactPhones,
}

context('Other contacts', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubAuthUser')
    })

    it('Other contacts page is visible', () => {
      const prisonerData: Prisoner[] = [
        {
          firstName: 'BILL',
          lastName: 'GATES',
          restrictedPatient: false,
        },
      ]
      cy.task('stubGetPrisoner', prisonerData)
      cy.task('stubGetPrisonerContacts', { offenderNo: 'A1234AA', response: { offenderContacts: [defaultContact] } })
      cy.task('stubGetPrisonerAddresses', { personId: 112, response: addresses1 })
      cy.signIn()
      Page.verifyOnPage(IndexPage)

      cy.visit('/other-personal-contacts/A1234AA')
      Page.verifyOnPage(OtherPersonalContacts)

      cy.contains('Steve Jobs')
      cy.contains('Brother')
      cy.contains('Mobile 07711333444')
      cy.contains('Business 011333444 extension number 777')

      cy.get('dl').within(() => {
        cy.contains('email@thecontact.com')
        cy.contains('Flat A')
        cy.contains('13 High Street')
        cy.contains('Ulverston')
        cy.contains('West Yorkshire')
        cy.contains('LS1 AAA')
        cy.contains('England')
        cy.contains('Home 0115 9456789')
        cy.contains('Home')
      })
    })
  })
})
