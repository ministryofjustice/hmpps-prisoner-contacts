import { stubFor } from './wiremock'
import { Prisoner } from '../../server/services/prisonerSearchService'

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/health/ping',
    },
    response: { status: 200 },
  })

const stubGetPrisoner = (response: Prisoner[]) =>
  stubFor({
    request: {
      method: 'POST',
      urlPath: '/prisoner-search/prisoner-numbers',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

export default {
  stubPrisonerSearchPing: ping,
  stubGetPrisoner,
}
