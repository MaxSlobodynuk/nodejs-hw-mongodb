import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getOneContactController,
  getContactsController,
  createContactController,
} from '../controllers/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getOneContactController));

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));


export default router;