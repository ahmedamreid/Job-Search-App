import 'dotenv/config'
process.on('uncaughtException', (err) => {
    console.log('uncaughtException triggered', err);
})
import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import userRouter from './src/modules/User/user.routes.js'
import { globalError } from './src/middleware/globalError.js';
import { AppError } from './src/utils/AppError.js';
import companyRouter from './src/modules/Company/company.routes.js';
import jobRouter from './src/modules/Job/job.routes.js';

const app = express()
const port = process.env.PORT || 3687

app.use(express.json())

app.get('/', (req, res) => res.send('Job_Search_App Server'))
app.use('/users', userRouter)
app.use('/company', companyRouter)
app.use('/jobs', jobRouter)

app.use('*', (req, res, next) => {
    next(new AppError(`Path ${req.originalUrl} Doesn't Exist!`, 404))
})

app.use(globalError)

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection triggered', err);
})

app.listen(port, () => console.log(`Job_Search_App Server is running on port ${port}!`))
