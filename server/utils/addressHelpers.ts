import { capitalize } from './utils'
import { PrisonApiAddress, PrisonApiEmail, PrisonApiTelephone } from '../services/nomisPrisonerService'

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
export const getPhone = (phones: PrisonApiTelephone[]) =>
  phones &&
  phones
    .map(phone => {
      const { ext, number, type } = phone
      const extension = ext ? ` extension number ${ext}` : ''
      return `${PHONES_TYPE[type]} ${number}${extension}`
    })
    .join(',<br>')

export const getEmail = (emails: PrisonApiEmail[]) => emails && emails.map(email => email.email).join(',<br>')

export const getAddress = (address: PrisonApiAddress) => {
  if (!address) {
    return ''
  }
  const flat = address.flat && `Flat ${address.flat}`
  return [
    flat,
    address.premise,
    address.street,
    address.locality,
    address.town,
    address.county,
    address.postalCode,
    address.country,
  ]
    .filter(value => value)
    .join('<br>')
}

export const getAddressUsage = (address: PrisonApiAddress) => {
  return address?.addressType && capitalize(address.addressType.replace(' Address', ''))
}

export default {
  getPhone,
  getAddress,
  getAddressUsage,
}
