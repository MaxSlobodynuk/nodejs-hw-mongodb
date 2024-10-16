import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const setupServer = () => {
  const app = express();

  const PORT = Number(env('PORT', '3000'));

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    console.log('Contact found:', contact);

    if (!contact) {
      res.status(404).json({
        message: 'Sorry, but we don`t have such a contact!',
      });
      return;
    }

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contact,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.use((error, req, res) => {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
