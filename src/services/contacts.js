import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  userId,
}) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const userQuery = Contact.find();

  userQuery.where('userId').equals(userId);

  const [contacts, count] = await Promise.all([
    userQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
    Contact.countDocuments({ userId }),
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

export const getContactById = async (contactId, userId) => {
  const contacts = await Contact.findOne({ _id: contactId, userId });

  return contacts;
};

export const createContact = async (payload) => {
  console.log('Received payload in createContact:', payload);
  const contact = await Contact.create(payload);

  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};

export const updateContact = async (contactId, userId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
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
