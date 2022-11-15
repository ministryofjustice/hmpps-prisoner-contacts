import { convertToTitleCase } from '../utils/utils'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import NomisPrisonerService, { Address, Context } from './nomisPrisonerService'

interface UserDetails {
  name: string
  displayName: string
}

interface ContactDto {
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

interface TelephoneDto {
  number: string
  type: string
  ext?: string
}

interface AddressUsageDto {
  addressUsage?: string
  addressUsageDescription?: string
  activeFlag: boolean
}

interface AddressDto {
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

interface DisplayContact {
  phoneNumber: string
  email: string
  address: string
  postcode: string
  country: string
  landline: string
  addressType: string
}

export default class ContactService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly nomisPrisonerService: NomisPrisonerService,
  ) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsAuthClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name) }
  }

  async assembleContacts(context: Context, offenderNo: string) {
    const contacts = await this.nomisPrisonerService.getPrisonerContacts(context, offenderNo)

    // Convert from Prison-api to a prisoner-contact-registry friendly format
    // TODO, full logic for this is in prisoner-contact-registry, see
    // https://github.com/ministryofjustice/prisoner-contact-registry/blob/291affa271e6476e57015a2cfcf85986ef12a0ac/src/main/kotlin/uk/gov/justice/digital/hmpps/prisonercontactregistry/service/PrisonerContactRegistryService.kt#L31

    const offenderContacts = await Promise.all(
      // [...contacts.otherContacts, ...contacts.nextOfKin]
      contacts.offenderContacts.map(async contact => {
        const addresses: Address[] = await this.nomisPrisonerService.getPrisonerAddresses(context, contact.personId)
        const rtn: ContactDto = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          contactType: contact.contactType,
          contactTypeDescription: contact.contactTypeDescription,
          relationshipCode: contact.relationship,
          relationshipDescription: contact.relationshipDescription,
          personId: contact.personId,
          addresses: addresses.map(address => ({
            ...address,
            phones: [],
            addressUsages: [],
          })),
          approvedVisitor: false,
          emergencyContact: false,
        }
        return rtn
      }),
    )

    const toDisplayAddress = (addresses: AddressDto[]) => {
      const a = addresses[0]
      const address = `${a?.flat} ${a?.premise} ${a?.street} ${a?.locality} ${a?.town} ${a?.county}`
      return { address, postcode: a?.postalCode, country: a?.country }
    }

    // Rough conversion to display-ready format

    const displayContacts: DisplayContact[] = offenderContacts.map(contact => {
      return {
        firstName: contact.firstName,
        lastName: contact.lastName,
        contactTypeDescription: contact.contactTypeDescription,
        relationshipDescription: contact.relationshipDescription,
        phoneNumber: 'TODO',
        email: 'TODO',
        ...toDisplayAddress(contact.addresses),
        landline: 'TODO',
        addressType: 'TODO',
      }
    })
    return displayContacts
  }
}
