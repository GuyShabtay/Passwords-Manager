import mongoose from 'mongoose';

const AccountDetailsSchema = new mongoose.Schema({
  userId: String,
  credentials: [
    {
      category: { type: String },

      websites: [
        {
          name: String,
          password: String,
          iv: String     
        }
      ],

      createdAt: { type: Date, default: Date.now }
    }
  ],
});

export const AccountDetails = mongoose.model('AccountDetails', AccountDetailsSchema);
