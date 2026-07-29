import { connect } from 'mongoose';

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/JobSearch'

export const dbConnection = connect(mongoURI).then(() => {
    console.log('connected to database ✔');
}).catch((err) => {
    console.log('connection failed ✘', err.message);
})
