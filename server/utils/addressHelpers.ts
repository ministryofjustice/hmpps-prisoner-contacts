import { capitalize } from './utils'
import { PrisonApiAddress, PrisonApiTelephone } from '../services/nomisPrisonerService'

export const getPhone = (phones: PrisonApiTelephone[]) =>
  phones &&
  phones
    .map(phone => {
      const { ext, number } = phone
      return ext ? `${number} extension number ${ext}` : number
    })
    .join(',<br>')

export const getAddress = (address: PrisonApiAddress) => {
  if (!address) {
    return 'Not entered'
  }
  const flat = address.flat && `Flat ${address.flat}`
  return [flat, address.premise, address.street, address.town, address.county].filter(value => value).join(', ')
}

export const getAddressUsage = (address: PrisonApiAddress) => {
  return address?.addressType && capitalize(address.addressType.replace(' Address', ''))
}

export default {
  getPhone,
  getAddress,
  getAddressUsage,
}
