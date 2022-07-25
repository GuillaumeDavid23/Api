import express from 'express'
import path from 'path'
import moment from 'moment'
moment.locale('fr')

// Imports des routes:
import {
	appointmentRoutes,
	inventoryRoutes,
	propertyRoutes,
	rentalRoutes,
	transactionRoutes,
	userRoutes,
} from './routes/index.js'

const app = express()

const __dirname = path.resolve()

const logger = (req, res, next) => {
	console.log(
		`${moment().format('YYYY-MM-Do - HH:mm:ss')}> ${
			req.originalUrl
		} called from ${req.ip}`
	)
	next()
}

app.use(logger)

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	)
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	)
	next()
})

app.use(express.json()).use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname + '/public')))

// Intégration des routes:
app.use('/api/appointment', appointmentRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/property', propertyRoutes)
app.use('/api/rental', rentalRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/user', userRoutes)

export default app
