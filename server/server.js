require('dotenv').config({ path: './config/config.env'});
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDb = require('./config/db');

const app = express();

// connecting to db
connectDb();

// body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// middlewares
app.use(cors());
app.use(morgan('common'));
app.use(helmet());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/users', require('./routes/user'));
app.use('/api/favourites', require('./routes/favourites'));

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is listening on port: ${PORT}`));