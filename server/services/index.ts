import { dataAccess } from '../data'
import UserService from './userService'
import NomisPrisonerService from './nomisPrisonerService'
import ContactService from './contactService'
import PrisonerSearchService from './prisonerSearchService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const nomisPrisonerService = new NomisPrisonerService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const contactService = new ContactService(nomisPrisonerService)

  return {
    userService,
    nomisPrisonerService,
    prisonerSearchService,
    contactService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
