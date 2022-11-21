import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'
import type HmppsAuthClient from '../data/hmppsAuthClient'

import { components } from '../@types/nomisPrisonerImport'

export type PrisonApiContact = components['schemas']['OffenderContact']
export type PrisonApiContacts = components['schemas']['OffenderContacts']
export type PrisonApiAddress = components['schemas']['AddressDto']
export type PrisonApiTelephone = components['schemas']['Telephone']
export type PrisonApiAddressUsage = components['schemas']['AddressUsageDto']
export type PrisonApiEmail = components['schemas']['Email']

export interface Context {
  username?: string
  token?: string
}

export default class NomisPrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static restClient(token: string): RestClient {
    return new RestClient('Nomis Prisoner API Client', config.apis.prisonApi, token)
  }

  async getPrisonerContacts(context: Context, offenderNo: string): Promise<PrisonApiContacts> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.debug(`getting contact details for ${offenderNo}`)
    return NomisPrisonerService.restClient(token).get<PrisonApiContacts>({
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
