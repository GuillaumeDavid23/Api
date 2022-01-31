import express from 'express'
import db from './db/db.js'

// Routes:
import userRoutes from './routes/user.js'
import transactionRoutes from './routes/transaction.js'
import agentRoutes from './routes/agent.js'

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
app.use(express.urlencoded())

app.use('/user', userRoutes)
app.use('/transaction', transactionRoutes)
app.use('/agent', agentRoutes)

export default app
