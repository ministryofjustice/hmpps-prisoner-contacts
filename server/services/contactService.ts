import { convertToTitleCase } from '../utils/utils'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import NomisPrisonerService, {
  Context,
  PrisonApiAddress,
  PrisonApiEmail,
  PrisonApiTelephone,
} from './nomisPrisonerService'
import { getAddress, getAddressUsage, getEmail, getPhone } from '../utils/addressHelpers'

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
  emails: PrisonApiEmail[]
  phones: PrisonApiTelephone[]
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

interface DisplayContact {
  phoneNumber: string
  email: string
  address: string
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
      contacts.offenderContacts
        .filter(c => c.contactType === 'S')
        .map(async contact => {
          const addresses: PrisonApiAddress[] = await this.nomisPrisonerService.getPrisonerAddresses(
            context,
            contact.personId,
          )
          const phones: PrisonApiTelephone[] = await this.nomisPrisonerService.getPrisonerPhones(
            context,
            contact.personId,
          )
          const emails: PrisonApiEmail[] = await this.nomisPrisonerService.getPrisonerEmails(context, contact.personId)
          return {
            firstName: contact.firstName,
            lastName: contact.lastName,
            contactType: contact.contactType,
            contactTypeDescription: contact.contactTypeDescription,
            relationshipCode: contact.relationshipCode,
            relationshipDescription: contact.relationshipDescription,
            personId: contact.personId,
            addresses: addresses.map(address => ({
              ...address,
              phones: address.phones as TelephoneDto[],
              addressUsages: address.addressUsages as AddressUsageDto[],
            })),
            approvedVisitor: false,
            emergencyContact: false,
            emails,
            phones,
          }
        }),
    )

    const toDisplayAddress = (addresses: AddressDto[]) => {
      const a = addresses?.length && addresses[0]
      return {
        address: getAddress(a),
        landline: getPhone(a?.phones),
        addressType: getAddressUsage(a),
      }
    }

    const sortByName = (t1: ContactDto, t2: ContactDto): number => {
      if (t1 && t2) {
        if (t1.lastName !== t2.lastName) return t1.lastName.localeCompare(t2.lastName)
        return t1.firstName.localeCompare(t2.firstName)
      }
      if (t1) return -1
      if (t2) return 1
      return 0
    }

    // Rough conversion to display-ready format

    const displayContacts: DisplayContact[] = offenderContacts.sort(sortByName).map(contact => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      contactTypeDescription: contact.contactTypeDescription,
      relationshipDescription: contact.relationshipDescription,
      ...toDisplayAddress(contact.addresses),
      email: getEmail(contact.emails),
      phoneNumber: getPhone(contact.phones),
    }))

    return displayContacts
  }
}
