import { Router } from 'express';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { getContacts, getOneContact } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getOneContact));


export default router;