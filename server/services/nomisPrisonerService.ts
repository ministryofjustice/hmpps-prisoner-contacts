import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'
import type HmppsAuthClient from '../data/hmppsAuthClient'

export interface Context {
  username?: string
  token?: string
}

export interface Contact {
  lastName: string
  firstName: string
  middleName: string
  contactType: string
  contactTypeDescription: string
  relationship: string
  relationshipDescription: string
  commentText: string
  emergencyContact: true
  nextOfKin: false
  relationshipId: number
  personId: number
  activeFlag: true
  expiryDate: string
  approvedVisitorFlag: true
  canBeContactedFlag: false
  awareOfChargesFlag: true
  contactRootOffenderId: number
  bookingId: number
  createDateTime: string
}

export interface Contacts {
  // bookingId: number
  // nextOfKin: Contact[]
  offenderContacts: Contact[]
}

export interface Address {
  addressType?: string
  flat?: string
  premise?: string
  street?: string
  locality?: string
  town?: string
  postalCode?: string
  county?: string
  country?: string
  comment?: string
  primary: boolean
  noFixedAddress: boolean
  startDate?: string
  endDate?: string
  // TODO phones: TelephoneDto[]
  // TODO addressUsages: AddressUsageDto[]
}

export default class NomisPrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static restClient(token: string): RestClient {
    return new RestClient('Nomis Prisoner API Client', config.apis.prisonApi, token)
  }

  async getPrisonerContacts(context: Context, offenderNo: string): Promise<Contacts> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.info(`getting contact details for ${offenderNo}`)
    return NomisPrisonerService.restClient(token).get<Contacts>({
      path: `/api/offenders/${offenderNo}/contacts`,
    })
  }

  async getPrisonerAddresses(context: Context, personId: number): Promise<Address[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.info(`getting contact details for ${personId}`)
    return NomisPrisonerService.restClient(token).get<Address[]>({
      path: `/api/persons/${personId}/addresses`,
    })
  }
}

/*
 TODO:

  const getPersonEmails = (context, personId) => get(context, `/api/persons/${personId}/emails`)

  const getPersonPhones = (context, personId) => get(context, `/api/persons/${personId}/phones`)
 */
