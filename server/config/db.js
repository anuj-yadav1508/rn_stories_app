require('dotenv').config({ path: './config/config.env' });
const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log(`Mongodb connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDb;