import ContactService from './contactService'
import NomisPrisonerService, {
  PrisonApiAddress,
  PrisonApiContact,
  PrisonApiContacts,
  PrisonApiEmail,
  PrisonApiTelephone,
} from './nomisPrisonerService'

jest.mock('../data/hmppsAuthClient')
jest.mock('./nomisPrisonerService')

const token = 'some token'
const username = 'user'
const context = { token, username }

const businessPrimary: PrisonApiAddress = {
  addressType: 'Business',
  flat: '222',
  locality: 'Test locality',
  premise: '999',
  street: 'Business street',
  town: 'London',
  postalCode: 'W1 ABC',
  county: 'London',
  country: 'England',
  comment: null,
  primary: true,
  noFixedAddress: false,
  startDate: '2020-05-01',
  endDate: null,
  phones: [],
  addressUsages: [],
}

const phones1: PrisonApiTelephone[] = [
  { number: '07711333444', type: 'MOB' },
  { number: '011333444', type: 'BUS', ext: '777' },
]

const homePrimary = {
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
  phones: phones1,
}

const addresses1: PrisonApiAddress[] = [homePrimary, businessPrimary]

const emails1: PrisonApiEmail[] = [{ email: 'email@addressgoeshere.com' }]

const defaultContact: PrisonApiContact = {
  firstName: 'STEVE',
  lastName: 'JOBS',
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
  emails: emails1,
}

const official: PrisonApiContact = {
  ...defaultContact,
  lastName: 'KIMBUR',
  firstName: 'ARENENG',
  contactType: 'O',
  contactTypeDescription: 'Official',
  relationshipCode: 'PROB',
  relationshipDescription: 'Probation Officer',
  personId: 111,
}

const nextOfKin: PrisonApiContact = {
  ...defaultContact,
  nextOfKin: true,
}
const emergency: PrisonApiContact = {
  ...defaultContact,
  emergencyContact: true,
}
const social: PrisonApiContact = {
  ...defaultContact,
  personId: 112,
}

const otherContacts: PrisonApiContact[] = [official, social]

const prisonApiContacts: PrisonApiContacts = { offenderContacts: otherContacts }

describe('Contact service', () => {
  let nomisPrisonerService: jest.Mocked<NomisPrisonerService>
  let contactService: ContactService

  describe('assembleContacts', () => {
    beforeEach(() => {
      nomisPrisonerService = new NomisPrisonerService(null) as jest.Mocked<NomisPrisonerService>
      contactService = new ContactService(nomisPrisonerService)
    })

    it('Omits official contacts', async () => {
      nomisPrisonerService.getPrisonerContacts.mockResolvedValue(prisonApiContacts)
      nomisPrisonerService.getPrisonerAddresses.mockResolvedValue(addresses1)

      const result = await contactService.assembleContacts(context, 'A1234AA')

      expect(result).toEqual([
        {
          address: 'Flat A<br>13<br>High Street<br>Ulverston<br>West Yorkshire<br>LS1 AAA<br>England',
          addressType: 'Home',
          contactTypeDescription: 'Social',
          email: 'email@addressgoeshere.com',
          firstName: 'STEVE',
          landline: 'Mobile 07711333444,<br>Business 011333444 extension number 777',
          lastName: 'JOBS',
          phoneNumber: undefined,
          relationshipDescription: 'Brother',
        },
      ])
    })

    it('Omits next of kin and emergency contacts', async () => {
      nomisPrisonerService.getPrisonerContacts.mockResolvedValue({ offenderContacts: [nextOfKin, emergency] })

      const result = await contactService.assembleContacts(context, 'A1234AA')
      expect(result).toHaveLength(0)
    })

    it('Sorts contacts by name', async () => {
      const nonPrimary: PrisonApiAddress = {
        locality: 'Non-primary',
        primary: false,
        noFixedAddress: false,
      }
      const primary: PrisonApiAddress = {
        locality: 'Primary',
        primary: true,
        noFixedAddress: false,
      }

      const c1: PrisonApiContact = {
        ...defaultContact,
        firstName: 'STEVE',
        lastName: 'SMITH',
        personId: 112,
      }
      const c2: PrisonApiContact = {
        ...defaultContact,
        firstName: 'JOSH',
        lastName: 'SMITH',
        personId: 113,
      }
      const c3: PrisonApiContact = {
        ...defaultContact,
        firstName: 'STEVE',
        lastName: 'ASKEW',
        personId: 114,
      }
      nomisPrisonerService.getPrisonerContacts.mockResolvedValue({ offenderContacts: [c1, c2, c3] })
      nomisPrisonerService.getPrisonerAddresses.mockResolvedValue([nonPrimary, primary])

      const result = await contactService.assembleContacts(context, 'A1234AA')

      expect(result[0].firstName).toEqual('STEVE')
      expect(result[0].lastName).toEqual('ASKEW')
      expect(result[1].firstName).toEqual('JOSH')
      expect(result[1].lastName).toEqual('SMITH')
      expect(result[2].firstName).toEqual('STEVE')
      expect(result[2].lastName).toEqual('SMITH')

      expect(result[0].address).toEqual('Primary')
    })

    it('Propagates error', async () => {
      nomisPrisonerService.getPrisonerContacts.mockRejectedValue(new Error('some error'))

      await expect(contactService.assembleContacts(context, 'A1234AA')).rejects.toEqual(new Error('some error'))
    })
  })
})
