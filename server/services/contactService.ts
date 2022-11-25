import NomisPrisonerService, {
  AddressDto,
  ContactDto,
  EmailDto,
  PrisonApiAddress,
  PrisonApiContacts,
  TelephoneDto,
} from './nomisPrisonerService'
import { getAddress, getAddressUsage, getEmail, getPhone } from '../utils/addressHelpers'
import { Context } from '../authentication/auth'

interface DisplayContact {
  firstName: string
  lastName: string
  contactTypeDescription: string
  relationshipDescription: string
  phoneNumber: string
  email: string
  address: string
  landline: string
  addressType: string
}

export default class ContactService {
  constructor(private readonly nomisPrisonerService: NomisPrisonerService) {}

  async assembleContacts(context: Context, offenderNo: string) {
    const contacts: PrisonApiContacts = await this.nomisPrisonerService.getPrisonerContacts(context, offenderNo)

    // Convert from Prison-api to a prisoner-contact-registry friendly format
    // TODO, full logic for this is in prisoner-contact-registry, see
    // https://github.com/ministryofjustice/prisoner-contact-registry/blob/291affa271e6476e57015a2cfcf85986ef12a0ac/src/main/kotlin/uk/gov/justice/digital/hmpps/prisonercontactregistry/service/PrisonerContactRegistryService.kt#L31

    const offenderContacts: ContactDto[] = await Promise.all(
      contacts.offenderContacts
        .filter(c => c.contactType === 'S' && !c.nextOfKin && !c.emergencyContact)
        .map(async contact => {
          const addresses: PrisonApiAddress[] = await this.nomisPrisonerService.getPrisonerAddresses(
            context,
            contact.personId,
          )
          return {
            firstName: contact.firstName,
            lastName: contact.lastName,
            contactType: contact.contactType,
            contactTypeDescription: contact.contactTypeDescription,
            relationshipCode: contact.relationshipCode,
            relationshipDescription: contact.relationshipDescription,
            personId: contact.personId,
            addresses: addresses as AddressDto[],
            //  TODO may need a mapping at some point
            //   addresses.map(address => ({
            //   ...address,
            //   phones: address.phones as TelephoneDto[],
            //   addressUsages: address.addressUsages as AddressUsageDto[],
            // })),
            nextOfKin: contact.nextOfKin,
            restrictions: contact.restrictions,
            approvedVisitor: contact.approvedVisitor,
            emergencyContact: contact.emergencyContact,
            emails: contact.emails as EmailDto[],
            phones: contact.phones as TelephoneDto[],
          }
        }),
    )

    const sortByName = (t1: ContactDto, t2: ContactDto): number => {
      if (t1 && t2) {
        if (t1.lastName !== t2.lastName) return t1.lastName.localeCompare(t2.lastName)
        return t1.firstName.localeCompare(t2.firstName)
      }
      if (t1) return -1
      if (t2) return 1
      return 0
    }

    // Conversion to display-ready format

    const displayContacts: DisplayContact[] = offenderContacts.sort(sortByName).map(contact => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      contactTypeDescription: contact.contactTypeDescription,
      relationshipDescription: contact.relationshipDescription,
      address: getAddress(contact.addresses),
      landline: getPhone(contact.addresses[0]?.phones),
      addressType: getAddressUsage(contact.addresses[0]),
      email: getEmail(contact.emails),
      phoneNumber: getPhone(contact.phones),
    }))

    return displayContacts
  }
}
