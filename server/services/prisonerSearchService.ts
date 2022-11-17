import RestClient from '../data/restClient'
import config from '../config'
import logger from '../../logger'
import type HmppsAuthClient from '../data/hmppsAuthClient'

export interface Context {
  username?: string
  token?: string
}

interface Prisoner {
  /** Prisoner Number */
  prisonerNumber?: string
  /** PNC Number */
  pncNumber?: string
  /** PNC Number */
  pncNumberCanonicalShort?: string
  /** PNC Number */
  pncNumberCanonicalLong?: string
  /** CRO Number */
  croNumber?: string
  /** Booking No. */
  bookingId?: string
  /** Book Number */
  bookNumber?: string
  /** First Name */
  firstName?: string
  /** Middle Names */
  middleNames?: string
  /** Last name */
  lastName?: string
  /** Date of Birth */
  dateOfBirth?: string
  /** Gender */
  gender?: string
  /** Ethnicity */
  ethnicity?: string
  /** Youth Offender? */
  youthOffender?: boolean
  /** Marital Status */
  maritalStatus?: string
  /** Religion */
  religion?: string
  /** Nationality */
  nationality?: string
  /** Status of the prisoner */
  status?: string
  /** Last Movement Type Code of prisoner */
  lastMovementTypeCode?: string
  /** Last Movement Reason of prisoner */
  lastMovementReasonCode?: string
  /** In/Out Status */
  inOutStatus?: 'IN,OUT'
  /** Prison ID */
  prisonId?: string
  /** Prison Name */
  prisonName?: string
  /** In prison cell location */
  cellLocation?: string
  /** Aliases Names and Details */
  // aliases?: components['schemas']['PrisonerAlias'][]
  /** Alerts */
  // alerts?: components['schemas']['PrisonerAlert'][]
  /** Cell Sharing Risk Assessment */
  csra?: string
  /** Prisoner Category */
  category?: string
  /** Legal Status */
  legalStatus?:
    | 'RECALL'
    | 'DEAD'
    | 'INDETERMINATE_SENTENCE'
    | 'SENTENCED'
    | 'CONVICTED_UNSENTENCED'
    | 'CIVIL_PRISONER'
    | 'IMMIGRATION_DETAINEE'
    | 'REMAND'
    | 'UNKNOWN'
    | 'OTHER'
  /** The prisoner's imprisonment status code. */
  imprisonmentStatus?: string
  /** The prisoner's imprisonment status description. */
  imprisonmentStatusDescription?: string
  /** Most serious offence for this sentence */
  mostSeriousOffence?: string
  /** Indicates that the offender has been recalled */
  recall?: boolean
  /** Indicates the the offender has an indeterminate sentence */
  indeterminateSentence?: boolean
  /** Start Date for this sentence */
  sentenceStartDate?: string
  /** Actual of most likely Release Date */
  releaseDate?: string
  /** Release Date Confirmed */
  confirmedReleaseDate?: string
  /** Sentence Expiry Date */
  sentenceExpiryDate?: string
  /** Licence Expiry Date */
  licenceExpiryDate?: string
  /** HDC Eligibility Date */
  homeDetentionCurfewEligibilityDate?: string
  /** HDC Actual Date */
  homeDetentionCurfewActualDate?: string
  /** HDC End Date */
  homeDetentionCurfewEndDate?: string
  /** Top-up supervision start date */
  topupSupervisionStartDate?: string
  /** Top-up supervision expiry date */
  topupSupervisionExpiryDate?: string
  /** Days added to sentence term due to adjustments. */
  additionalDaysAwarded?: number
  /** Release date for Non determinant sentence (if applicable). This will be based on one of ARD, CRD, NPD or PRRD. */
  nonDtoReleaseDate?: string
  /** Indicates which type of non-DTO release date is the effective release date. One of 'ARD’, 'CRD’, ‘NPD’ or 'PRRD’. */
  nonDtoReleaseDateType?: 'ARD' | 'CRD' | 'NPD' | 'PRRD'
  /** Date prisoner was received into the prison */
  receptionDate?: string
  /** Parole  Eligibility Date */
  paroleEligibilityDate?: string
  /** Automatic Release Date. If automaticReleaseOverrideDate is available then it will be set as automaticReleaseDate */
  automaticReleaseDate?: string
  /** Post Recall Release Date. if postRecallReleaseOverrideDate is available then it will be set as postRecallReleaseDate */
  postRecallReleaseDate?: string
  /** Conditional Release Date. If conditionalReleaseOverrideDate is available then it will be set as conditionalReleaseDate */
  conditionalReleaseDate?: string
  /** Actual Parole Date */
  actualParoleDate?: string
  /** current prison or outside with last movement information. */
  locationDescription?: string
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
