import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getOneContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Sorry, but we don`t have such a contact!');
  }

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  let photoUrl;

  if (req.file) {
    if (enableCloudinary === 'true') {
      photoUrl = await saveFileToCloudinary(req.file, 'photos');
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }
  }

  const contact = {
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  };

  const createdContact = await createContact(contact);

  res.json({
    status: 201,
    message: `Successfully created a contact!`,
    data: createdContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  let photoUrl;

  if (req.file) {
    photoUrl = await saveFileToUploadDir(req.file);
  }

  const result = await updateContact(
    contactId,
    req.user._id,
    req.body,
    photoUrl,
  );

  if (!result) {
    throw createHttpError(404, 'Sorry, but we don`t have such a contact!');
  }

  return res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Sorry, but we don`t have such a contact!');
  }

  res.status(204).end();
};
