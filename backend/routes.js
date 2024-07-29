import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {AccountDetails} from './models/AccountDetailsModel.js';
import {User} from './models/UserModel.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.AES_KEY, 'hex'); 

const iv = crypto.randomBytes(16); 

// Encrypt function
const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

// Decrypt function
const decrypt = (text, iv) => {
  let ivBuffer = Buffer.from(iv, 'hex');
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const router = express.Router();
const TOKEN_KEY = process.env.TOKEN_KEY;

// User registration
router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    const accountDetails = new AccountDetails({ email });
    await accountDetails.save();
    res.json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ email: user.email }, TOKEN_KEY, { expiresIn: '1h' });
    const userName = user.userName;
    res.json({ token, userName });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add credentials
router.post('/credentials', async (req, res) => {
  const { email, website, password } = req.body;
  try {
    const { iv, encryptedData } = encrypt(password);
    const updatedAccountDetails = await AccountDetails.findOneAndUpdate(
      { email: email }, 
      { $push: { credentials: { website, password: encryptedData, iv } } }, 
      { new: true, useFindAndModify: false } 
    );

    if (!updatedAccountDetails) {
      return res.status(404).send('Account not found');
    }

    res.json(updatedAccountDetails);
  } catch (err) {
    console.error('Error updating credentials:', err.message);
    res.status(500).send('Server Error');
  }
});


// Get all credentials for a specific user by email
router.get('/credentials/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const accountDetails = await AccountDetails.findOne({ email });
    const credentials = accountDetails.credentials;

    if (!credentials) {
      return res.status(404).send('Credentials not found');
    }

    const decryptedCredentials = credentials.map(cred => ({
      website: cred.website,
      password: decrypt(cred.password, cred.iv) ,
      id:cred._id
    }));

    res.json(decryptedCredentials);
  } catch (err) {
    console.error('Error fetching credentials:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get credentials by email and website name (search)
router.get('/credentials', async (req, res) => {
  const { email, website } = req.query; 
  try {
    const accountDetails = await AccountDetails.findOne({ email });
    if (!accountDetails) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const regex = new RegExp(website, 'i');

    const filteredCredentials = accountDetails.credentials.filter(cred => regex.test(cred.website));

    if (filteredCredentials.length === 0) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    const decryptedCredentials = filteredCredentials.map(cred => ({
      website: cred.website,
      password: decrypt(cred.password, cred.iv) ,
      id:cred._id
    }));
    res.json(decryptedCredentials);
  } catch (err) {
    console.error('Error fetching credentials:', err.message);
    res.status(500).send('Server Error');
  }
});

// Edit credentials
router.put('/credentials/:id', async (req, res) => {
  const { id } = req.params;
  const { email, website, password } = req.body;
  try {
    const accountDetails = await AccountDetails.findOne({ email });
    
    if (!accountDetails) {
      return res.status(404).json({ error: 'Account details not found' });
    }
    const credentialIndex = accountDetails.credentials.findIndex(cred => cred._id.toString() === id);

    if (credentialIndex === -1) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const { iv, encryptedData } = encrypt(password);

    accountDetails.credentials[credentialIndex] = { 
      ...accountDetails.credentials[credentialIndex], 
      website, 
      password: encryptedData, 
      iv 
    };
    const updatedAccountDetails = await accountDetails.save();
    res.json(updatedAccountDetails);
  } catch (err) {
    console.error('Error updating credential:', err.message);
    res.status(500).send('Server Error');
  }
});

// Delete credentials by ID
router.delete('/credentials/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.query; 
  try {
    const accountDetails = await AccountDetails.findOne({ email });

    if (!accountDetails) {
      return res.status(404).json({ error: 'Account details not found' });
    }
    const credentialIndex = accountDetails.credentials.findIndex(cred => cred._id.toString() === id);

    if (credentialIndex === -1) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    accountDetails.credentials.splice(credentialIndex, 1);
    const updatedAccountDetails = await accountDetails.save();
    res.json(updatedAccountDetails);
  } catch (err) {
    console.error('Error deleting credential:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
