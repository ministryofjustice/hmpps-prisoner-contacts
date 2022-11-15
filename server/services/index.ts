import { dataAccess } from '../data'
import UserService from './userService'
import NomisPrisonerService from './nomisPrisonerService'
import ContactService from './contactService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const nomisPrisonerService = new NomisPrisonerService(hmppsAuthClient)
  const contactService = new ContactService(hmppsAuthClient, nomisPrisonerService)

  return {
    userService,
    nomisPrisonerService,
    contactService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
