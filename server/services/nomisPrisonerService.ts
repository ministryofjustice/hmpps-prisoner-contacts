import RestClient from '../data/restClient'
import config from '../config'
import type HmppsAuthClient from '../data/hmppsAuthClient'

import { components } from '../@types/nomisPrisonerImport'
import { Context } from '../authentication/auth'

export type PrisonApiContact = components['schemas']['OffenderContact']
export type PrisonApiContacts = components['schemas']['OffenderContacts']
export type PrisonApiAddress = components['schemas']['AddressDto']
export type PrisonApiTelephone = components['schemas']['Telephone']
export type PrisonApiAddressUsage = components['schemas']['AddressUsageDto']
export type PrisonApiEmail = components['schemas']['Email']

export interface EmailDto {
  email: string
}

interface RestrictionDto {
  restrictionType: string
  restrictionTypeDescription: string
  startDate: string
  expiryDate?: string
  // True if applied globally to the contact or False if applied in the context of a visit
  globalRestriction: boolean
  comment?: string
}

export interface TelephoneDto {
  number: string
  type: string
  ext?: string
}

export interface AddressUsageDto {
  addressUsage?: string
  addressUsageDescription?: string
  activeFlag: boolean
}

export interface AddressDto {
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
  phones: TelephoneDto[]
  addressUsages: AddressUsageDto[]
}

export interface ContactDto {
  personId?: number
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: string
  relationshipCode?: string
  relationshipDescription?: string
  contactType?: string
  contactTypeDescription?: string
  approvedVisitor: boolean
  emergencyContact: boolean
  nextOfKin?: boolean
  restrictions?: RestrictionDto[]
  addresses: AddressDto[]
  commentText?: string
  emails: EmailDto[]
  phones: TelephoneDto[]
}

export default class NomisPrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static restClient(token: string): RestClient {
    return new RestClient('Nomis Prisoner API Client', config.apis.prisonApi, token)
  }

  async getPrisonerContacts(context: Context, offenderNo: string): Promise<PrisonApiContacts> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    return NomisPrisonerService.restClient(token).get<PrisonApiContacts>({
      path: `/api/offenders/${offenderNo}/contacts`,
      query: 'activeOnly=true',
    })
  }

  async getPrisonerAddresses(context: Context, personId: number): Promise<PrisonApiAddress[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    return NomisPrisonerService.restClient(token).get<PrisonApiAddress[]>({
      path: `/api/persons/${personId}/addresses`,
    })
  }

  async getPrisonerPhones(context: Context, personId: number): Promise<PrisonApiTelephone[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    return NomisPrisonerService.restClient(token).get<PrisonApiTelephone[]>({
      path: `/api/persons/${personId}/phones`,
    })
  }

  async getPrisonerEmails(context: Context, personId: number): Promise<PrisonApiEmail[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    return NomisPrisonerService.restClient(token).get<PrisonApiEmail[]>({
      path: `/api/persons/${personId}/emails`,
    })
  }
}
