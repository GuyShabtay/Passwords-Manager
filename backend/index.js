import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes.js'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;
app.use(express.json());
 app.use(cors());

app.use('/api', userRoutes); 

app.get('/', (req, res) => {
  return res.status(234).send('Welcome to the Passwords Manager!');
});

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
