import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();

  return contacts;
};

export const getContactById = async (contactId) => {
  const contacts = await Contact.findById(contactId);

  return contacts;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);

  return contact;
};
