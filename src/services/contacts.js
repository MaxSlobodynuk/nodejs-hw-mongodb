import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({ page, perPage, sortOrder, sortBy }) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [contacts, count] = await Promise.all([
    Contact.find().skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec(),
    Contact.countDocuments(),
  ]);

  const totalPages = Math.ceil(count / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    totalPages: totalPages,
    hasNextPage: Boolean(totalPages - page),
    hasPreviousPage: page > 1,
  };
};

export const getContactById = async (contactId) => {
  const contacts = await Contact.findById(contactId);

  return contacts;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);

  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
