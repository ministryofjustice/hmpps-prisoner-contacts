import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import { components } from '../@types/prisonerSearchImport'

export type Prisoner = components['schemas']['Prisoner']

export interface Context {
  username?: string
  token?: string
}

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Search API Client', config.apis.prisonerSearchApi, token)
  }

  async getPrisoner(context: Context, offenderNo: string): Promise<Prisoner> {
    const token = await this.hmppsAuthClient.getSystemClientToken(context.username)
    logger.debug(`getting details for ${offenderNo}`)
    const p = await PrisonerSearchService.restClient(token).post<Prisoner[]>({
      path: `/prisoner-search/prisoner-numbers`,
      data: { prisonerNumbers: [offenderNo] },
    })
    return p?.length && p[0]
  }
}
