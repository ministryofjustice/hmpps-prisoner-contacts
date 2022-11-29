import { AddressDto } from './nomisPrisonerService'
import { getAddress } from '../utils/addressHelpers'

const defaultAddress: AddressDto = {
  addressUsages: [],
  phones: [],
  primary: false,
  noFixedAddress: false,
}

describe('Address helpers', () => {
  describe('getAddress', () => {
    it('Sorts addresses by primary', async () => {
      const nonPrimary: AddressDto = {
        ...defaultAddress,
        locality: 'Non-primary',
        primary: false,
      }
      const primary: AddressDto = {
        ...defaultAddress,
        locality: 'Primary',
        primary: true,
      }

      const result = getAddress([nonPrimary, primary])

      expect(result).toEqual('Primary')
    })

    it('Sorts addresses by active', async () => {
      const nonActive: AddressDto = {
        ...defaultAddress,
        locality: 'Non-active',
        startDate: '2020-05-01',
        endDate: '2020-05-01',
      }
      const active: AddressDto = {
        ...defaultAddress,
        locality: 'Active',
        startDate: '2020-05-01',
        endDate: null,
      }

      const result = getAddress([nonActive, active])

      expect(result).toEqual('Active')
    })

    it('Sorts addresses by start date', async () => {
      const addr1: AddressDto = {
        ...defaultAddress,
        locality: 'Older',
        startDate: '2022-10-01',
      }
      const addr2: AddressDto = {
        ...defaultAddress,
        locality: 'Newer',
        startDate: '2022-11-01',
      }
      const result = getAddress([addr1, addr2])

      expect(result).toEqual('Newer')
    })

    it('No fixed address', async () => {
      const addr1: AddressDto = {
        ...defaultAddress,
        primary: false,
        noFixedAddress: true,
      }

      const result = getAddress([addr1])

      expect(result).toEqual('No fixed address')
    })
  })
})
