import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import ContactController from './contactController'
import NomisPrisonerService from '../services/nomisPrisonerService'
import ContactService from '../services/contactService'
import PrisonerSearchService from '../services/prisonerSearchService'

export interface Services {
  nomisPrisonerService: NomisPrisonerService
  prisonerSearchService: PrisonerSearchService
  contactService: ContactService
}
export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const contactController = new ContactController(services.contactService, services.prisonerSearchService)

  get('/other-personal-contacts/:offenderNo', (req, res) => contactController.getContacts(req, res))

  return router
}
