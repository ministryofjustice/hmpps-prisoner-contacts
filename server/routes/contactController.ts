import { Request, Response } from 'express'
import ContactService from '../services/contactService'
import { Context } from '../authentication/auth'
import PrisonerSearchService from '../services/prisonerSearchService'
import { convertToTitleCase } from '../utils/utils'

function getContext(res: Response): Context {
  return {
    username: res?.locals?.user?.username,
    token: res?.locals?.user?.token,
  }
}

export default class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly prisonerSearchService: PrisonerSearchService,
  ) {}

  async getContacts(req: Request, res: Response): Promise<void> {
    const { offenderNo } = req.params

    const context = getContext(res)
    const prisoner = await this.prisonerSearchService.getPrisoner(context, offenderNo)
    const displayContacts = await this.contactService.assembleContacts(context, offenderNo)

    res.render('pages/contact', {
      name: convertToTitleCase(`${prisoner.firstName} ${prisoner.lastName}`),
      displayContacts,
    })
  }
}
