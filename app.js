import express from 'express'
import db from './db/db.js'
import path from 'path'

// Imports des routes:
import {
	agentRoutes,
	appointmentRoutes,
	buyerRoutes,
	inventoryRoutes,
	propertyRoutes,
	rentalRoutes,
	roleRoutes,
	sellerRoutes,
	transactionRoutes,
	userRoutes,
	wishlistRoutes,
} from './routes/index.js'

const app = express()

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

app.use(express.json())

// Intégration des routes:
app.use('/images', express.static(path.join(path.dirname('uploads'))))
app.use('/user', userRoutes)
app.use('/appointment', userRoutes)
app.use('/transaction', transactionRoutes)
app.use('/agent', agentRoutes)
app.use('/property', propertyRoutes)

export default app
