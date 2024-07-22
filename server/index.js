const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRoutes = require('./routes/authRoutes');
const docRoutes = require('./routes/docRoutes');
const {Authorized} = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})); 
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/documents', Authorized, docRoutes);

mongoose.connect(process.env.MONGODB_URI, {
 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

module.exports = app;
