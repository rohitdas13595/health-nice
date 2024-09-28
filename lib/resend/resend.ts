import {
  CreateContactOptions,
  CreateEmailOptions,
  GetContactOptions,
  Resend,
} from "resend";
import { settings } from "../settings";

export class ResendService {
  public client: Resend;
  constructor() {
    this.client = new Resend(settings.resendApiKey);
  }

  async addContact(contact: CreateContactOptions) {
    return await this.client.contacts.create(contact);
  }

  async getContact(options: GetContactOptions) {
    return await this.client.contacts.get(options);
  }

  async sendEmail(options: CreateEmailOptions) {
    console.log(options);
    try {
      return await this.client.emails.send(options);
    } catch (e) {
      console.log(e);
      return;
    }
  }
}

export const resendService = new ResendService();
