import RestClient from '../data/restClient'
import config from '../config'
import type HmppsAuthClient from '../data/hmppsAuthClient'

import { components } from '../@types/nomisPrisonerImport'
import { components as registryComponents } from '../@types/prisonerContactRegistry'
import { Context } from '../authentication/auth'

export type PrisonApiContact = components['schemas']['OffenderContact']
export type PrisonApiContacts = components['schemas']['OffenderContacts']
export type PrisonApiAddress = components['schemas']['AddressDto']
export type PrisonApiTelephone = components['schemas']['Telephone']
export type PrisonApiAddressUsage = components['schemas']['AddressUsageDto']
export type PrisonApiEmail = components['schemas']['Email']

export type AddressUsageDto = registryComponents['schemas']['AddressUsageDto']
export type TelephoneDto = registryComponents['schemas']['TelephoneDto']
export type AddressDto = registryComponents['schemas']['AddressDto']
export type ContactDtoBase = registryComponents['schemas']['ContactDto']

export interface EmailDto {
  email: string
}

export interface ContactDto extends ContactDtoBase {
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
