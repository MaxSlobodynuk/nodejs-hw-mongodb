import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getOneContactController,
  getContactsController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getOneContactController));

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(patchContactController),
);

export default router;
