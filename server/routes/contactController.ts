import { Request, Response } from 'express'
import ContactService from '../services/contactService'
import { Context } from '../services/nomisPrisonerService'

function context(res: Response): Context {
  return {
    username: res?.locals?.user?.username,
    token: res?.locals?.user?.token,
  }
}

export default class ContactController {
  constructor(private readonly contactService: ContactService) {}

  async getContacts(req: Request, res: Response): Promise<void> {
    const { offenderNo } = req.params
    const displayContacts = await this.contactService.assembleContacts(context(res), offenderNo)

    res.render('pages/contact', {
      name: 'TODO',
      displayContacts,
    })
  }
}
