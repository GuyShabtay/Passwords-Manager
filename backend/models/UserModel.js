import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
   email: { type: String, unique: true }, 
  otp: String,
  otpExpires: Date,
});
export const User = mongoose.model('User', UserSchema);
