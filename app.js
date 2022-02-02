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

app.use(express.json()).use(express.urlencoded({ extended: true }))

// Intégration des routes:
app.use('/api/images', express.static(path.join(path.dirname('uploads'))))
app.use('/api/agent', agentRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/buyer', buyerRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/property', propertyRoutes)
app.use('/api/rental', rentalRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/seller', sellerRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/user', userRoutes)
app.use('/api/wishlist', wishlistRoutes)

export default app
