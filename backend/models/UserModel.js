import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: String,
  // email: { type: String, unique: true }, 
  password: String,
   email: { type: String, unique: true }, // add this
  otp: String,
  otpExpires: Date,
});
export const User = mongoose.model('User', UserSchema);
