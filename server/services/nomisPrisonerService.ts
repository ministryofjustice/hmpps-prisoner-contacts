import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'
import type HmppsAuthClient from '../data/hmppsAuthClient'

export interface Context {
  username?: string
  token?: string
}

export interface PrisonApiContact {
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

interface Contacts {
  // bookingId: number
  // nextOfKin: Contact[]
  offenderContacts: PrisonApiContact[]
}

export interface PrisonApiAddress {
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
  phones: PrisonApiTelephone[]
  addressUsages: PrisonApiAddressUsage[]
}

export interface PrisonApiTelephone {
  number: string
  type: string
  ext?: string
}

export interface PrisonApiAddressUsage {
  addressUsage?: string
  addressUsageDescription?: string
  activeFlag?: boolean
}

export interface PrisonApiEmail {
  email: string
}

export default class NomisPrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static restClient(token: string): RestClient {
    return new RestClient('Nomis Prisoner API Client', config.apis.prisonApi, token)
  }

  async getPrisonerContacts(context: Context, offenderNo: string): Promise<Contacts> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.debug(`getting contact details for ${offenderNo}`)
    return NomisPrisonerService.restClient(token).get<Contacts>({
      path: `/api/offenders/${offenderNo}/contacts`,
    })
  }

  async getPrisonerAddresses(context: Context, personId: number): Promise<PrisonApiAddress[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.debug(`getting address details for ${personId}`)
    return NomisPrisonerService.restClient(token).get<PrisonApiAddress[]>({
      path: `/api/persons/${personId}/addresses`,
    })
  }

  async getPrisonerPhones(context: Context, personId: number): Promise<PrisonApiTelephone[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.debug(`getting phone details for ${personId}`)
    return NomisPrisonerService.restClient(token).get<PrisonApiTelephone[]>({
      path: `/api/persons/${personId}/phones`,
    })
  }

  async getPrisonerEmails(context: Context, personId: number): Promise<PrisonApiEmail[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.debug(`getting email details for ${personId}`)
    return NomisPrisonerService.restClient(token).get<PrisonApiEmail[]>({
      path: `/api/persons/${personId}/emails`,
    })
  }
}
