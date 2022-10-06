import { connectToDatabase } from '../db/db.js'

import { resetUsers, destroyUsers } from './seeders/UserSeeder.js'
import { resetProperties, destroyProperties } from './seeders/PropertySeeder.js'

await connectToDatabase()

const seedAll = async () => {
	console.log('Seeding all...')
	try {
		await resetUsers()
		await resetProperties()

		console.log('Database seeded!')
		process.exit(0)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

const unSeedAll = async () => {
	try {
		await destroyUsers()
		await destroyProperties()

		console.log('Database tables dropped!')
		process.exit(0)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

switch (process.argv[2]) {
	case '-d': {
		unSeedAll()
		break
	}
	default: {
		seedAll()
	}
}
