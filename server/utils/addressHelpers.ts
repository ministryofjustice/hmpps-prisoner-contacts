import { capitalize } from './utils'
import { AddressDto, EmailDto, TelephoneDto } from '../services/nomisPrisonerService'

// TODO should really get this from ref data
const PHONES_TYPE = {
  ALTB: 'Alternate Business',
  ALTH: 'Alternate Home',
  BUS: 'Business',
  FAX: 'Fax',
  HOME: 'Home',
  MOB: 'Mobile',
  VISIT: 'Agency Visit Line',
}
export const getPhone = (phones: TelephoneDto[]) =>
  phones &&
  phones
    .map(phone => {
      const { ext, number, type } = phone
      const extension = ext ? ` extension number ${ext}` : ''
      return `${PHONES_TYPE[type]} ${number}${extension}`
    })
    .join(',<br>')

export const getEmail = (emails: EmailDto[]) => emails && emails.map(email => email.email).join(',<br>')

const addressSorter = (addr1: AddressDto, addr2: AddressDto): number => {
  if (addr1 && addr2) {
    if (addr1.primary && !addr2.primary) return -1
    if (addr2.primary && !addr1.primary) return 1
    return addr2.startDate.localeCompare(addr1.startDate) // compare ISOs as string, latest 1st
  }
  if (addr1) return -1
  if (addr2) return 1
  return 0
}

export const getAddress = (addresses: AddressDto[]) => {
  if (!addresses) {
    return ''
  }
  const address: AddressDto = addresses.sort(addressSorter)[0]
  if (!address) {
    return ''
  }
  if (address.noFixedAddress) {
    return 'No fixed address'
  }
  return [
    address.flat && `Flat ${address.flat}`,
    (address.premise || address.street) && `${address.premise} ${address.street}`,
    address.locality,
    address.town,
    address.county,
    address.postalCode,
    address.country,
  ]
    .filter(value => value)
    .join('<br>')
}

export const getAddressUsage = (address: AddressDto) => {
  return address?.addressType && capitalize(address.addressType.replace(' Address', ''))
}

export default {
  getPhone,
  getAddress,
  getAddressUsage,
}
