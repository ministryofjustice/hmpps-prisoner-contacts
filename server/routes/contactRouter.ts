import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import ContactController from './contactController'
import NomisPrisonerService from '../services/nomisPrisonerService'
import ContactService from '../services/contactService'

export interface Services {
  nomisPrisonerService: NomisPrisonerService
  contactService: ContactService
}
export default function routes(router: Router, services: Services): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const contactController = new ContactController(services.contactService)

  get('/other-contacts/:offenderNo', (req, res) => contactController.getContacts(req, res))

  return router
}
