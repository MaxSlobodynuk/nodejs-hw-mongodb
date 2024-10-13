import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getOneContactController,
  getContactsController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { contactSchema, updateContactSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();
const jsonParser = express.json();
router.use(authenticate);

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getOneContactController));

router.post(
  '/contacts',
  upload.single('photo'),
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

router.patch(
  '/contacts/:contactId',
  upload.single('photo'),
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
