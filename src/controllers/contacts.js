import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';

const getContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

const getOneContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    // res.status(404).json({
    //   message: 'Sorry, but we don`t have such a contact!',
    // });

      throw createHttpError(404, 'Sorry, but we don`t have such a contact!')
  }


  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contact,
  });
  next(error);
};

export { getContacts, getOneContact };
