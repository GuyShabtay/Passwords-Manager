import mongoose from 'mongoose';

const AccountDetailsSchema = new mongoose.Schema({
  email: String,
  credentials: [
    {
      website: { type: String },
      password: { type: String },  
      iv: { type: String }        
    }
  ],
});

export const AccountDetails = mongoose.model('AccountDetails', AccountDetailsSchema);
