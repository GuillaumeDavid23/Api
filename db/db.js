import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectToDatabase = async (test = false) => {
	let connectString
	if (process.env.NODE_ENV !== 'production') {
		connectString = test
			? process.env.DATABASE_TEST_URL
			: process.env.DATABASE_URL
	} else {
		connectString = DATABASE_URL
	}

	console.log(`Try to connect with ${connectString}`)

	try {
		await mongoose.connect(connectString, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		console.error('Mongo connection success!')
	} catch (error) {
		console.error(`db:connectToDatabase> Connection failed! ${error}`)
		process.exit(1)
	}
}
