import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, unique: true }, 
  password: String
});
export const User = mongoose.model('User', UserSchema);
