import { stubFor } from './wiremock'
import {
  PrisonApiAddress,
  PrisonApiContacts,
  PrisonApiEmail,
  PrisonApiTelephone,
} from '../../server/services/nomisPrisonerService'

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/ping',
    },
    response: { status: 200 },
  })

const stubGetPrisonerContacts = ({ offenderNo, response }: { offenderNo: string; response: PrisonApiContacts }) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/api/offenders/${offenderNo}/contacts`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

const stubGetPrisonerAddresses = ({ personId, response }: { personId: number; response: PrisonApiAddress[] }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/api/persons/${personId}/addresses`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

const stubGetPrisonerPhones = ({ personId, response }: { personId: number; response: PrisonApiTelephone[] }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/api/persons/${personId}/phones`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

const stubGetPrisonerEmails = ({ personId, response }: { personId: number; response: PrisonApiEmail[] }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/api/persons/${personId}/emails`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

export default {
  stubPrisonApiPing: ping,
  stubGetPrisonerContacts,
  stubGetPrisonerAddresses,
  stubGetPrisonerPhones,
  stubGetPrisonerEmails,
}
