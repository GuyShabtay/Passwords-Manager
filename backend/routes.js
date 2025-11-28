import express from 'express';
import jwt from 'jsonwebtoken';
import { AccountDetails } from './models/AccountDetailsModel.js';
import { User } from './models/UserModel.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import argon2 from 'argon2';

dotenv.config();

const router = express.Router();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.AES_KEY, 'hex');

// Encryption helpers
const generateIV = () => crypto.randomBytes(16);

const encrypt = (text) => {
  const iv = generateIV();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

const decrypt = (encryptedText, ivHex) => {
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

//
// REGISTER USER (NO EMAIL)
//
router.post('/register', async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Only username must be unique now
    const userExists = await User.findOne({ userName });
    if (userExists) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    // Create AccountDetails with userId only
    const account = new AccountDetails({
      userId: newUser._id,
      credentials: [],
    });

    await account.save();

    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


//
// LOGIN USER (NO EMAIL)
//
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
      expiresIn: '1h',
    });

    res.json({
      token,
      userId: user._id,
      userName: user.userName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


//
// ADD NEW CREDENTIAL
//
// Add credentials
router.post('/credentials/:userId', async (req, res) => {
  const { userId } = req.params;
  const { category, websites } = req.body;

  if (!category || !websites || !websites.length || websites.some(w => !w.name || !w.password)) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Encrypt each website password
    const encryptedWebsites = websites.map(w => {
      const { iv, encryptedData } = encrypt(w.password);
      return { name: w.name, password: encryptedData, iv };
    });

    const newCredential = {
      category,
      websites: encryptedWebsites,
      createdAt: new Date(),
    };

    // Try to find the AccountDetails for this user
    let account = await AccountDetails.findOne({ userId });

    if (!account) {
      // If not found, create a new AccountDetails with this userId
      account = new AccountDetails({
        userId,
        credentials: [newCredential],
      });
    } else {
      // If found, push new credential
      account.credentials.push(newCredential);
    }

    await account.save();
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});





//
// GET ALL CREDENTIALS FOR USER (BY ID)
//
router.get('/credentials/:userId', async (req, res) => {
  const { userId } = req.params;
          // console.log('account',userId)

  try {
    // Find the AccountDetails document by userId
    const account = await AccountDetails.findOne({ userId });
          console.log('account',account)

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const grouped = {};

    account.credentials.forEach((cred) => {
      // Create category group if not exists
      if (!grouped[cred.category]) {
        grouped[cred.category] = [];
      }

      // Decrypt each website password
      const decryptedWebsites = cred.websites.map((w) => ({
        name: w.name,
        password: decrypt(w.password, w.iv),
      }));

      grouped[cred.category].push({
        id: cred._id,
        websites: decryptedWebsites,
      });
    });

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




//
// SEARCH CREDENTIALS BY WEBSITE
//
router.get('/credentials/:userId/search', async (req, res) => {
  const { userId } = req.params;
  const { website } = req.query;

  try {
    const account = await AccountDetails.findOne({ userId });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const regex = new RegExp(website, 'i');

    const matches = account.credentials.filter((c) =>
      c.websites.some((w) => regex.test(w))
    );

    const results = matches.map((cred) => ({
      id: cred._id,
      websites: cred.websites,
      password: decrypt(cred.password, cred.iv),
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


//
// UPDATE CREDENTIAL
//
router.put('/credentials/:userId/:credId', async (req, res) => {
  const { userId, credId } = req.params;
  const { category, websites, password } = req.body;

  try {
    const account = await AccountDetails.findOne({ userId });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const index = account.credentials.findIndex((c) => c._id.toString() === credId);
    if (index === -1) return res.status(404).json({ error: 'Credential not found' });

    const { iv, encryptedData } = encrypt(password);

    account.credentials[index] = {
      ...account.credentials[index],
      category,
      websites,
      password: encryptedData,
      iv,
    };

    await account.save();
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


//
// DELETE CREDENTIAL
//
router.delete('/credentials/:userId/:credId', async (req, res) => {
  const { userId, credId } = req.params;

  try {
    const account = await AccountDetails.findOne({ userId });
    if (!account) return res.status(404).json({ error: 'Account not found' });

    account.credentials = account.credentials.filter(
      (c) => c._id.toString() !== credId
    );

    await account.save();

    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




//
// WAKE UP ENDPOINT
//
router.get('/wakeup', (req, res) => {
  res.send('Server is awake!');
});

export default router;
