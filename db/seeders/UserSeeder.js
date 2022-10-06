import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import moment from 'moment'
import User from '../../models/User.js'
import { connectToDatabase } from '../db.js'

// Set lang to French
faker.setLocale('fr')

const createLoggableCustomers = async () => {
	console.log('Creating loggable customers...')

	try {
		await User({
			firstname: 'Mayvah',
			lastname: 'RAULT',
			email: 'may_rault@outlook.fr',
			password: await bcrypt.hash('Jesuisunbiscuit1', 10),
			ref: 'CLI0000000001'
		}).save()

		console.log('Loggable customers created successfully!')
	} catch (error) {
		console.error(`Creating loggable customers failed! (${error})`)
	}
}

const createLoggableAgents = async () => {
	console.log('Creating loggable agents...')

	try {
		await User({
			firstname: 'Benjamin',
			lastname: 'RAULT',
			email: 'b_rault@outlook.fr',
			role: 'agent',
			password: await bcrypt.hash('Jesuisunbiscuit1', 10),
			ref: 'AG0000000001'
		}).save()
		console.log('Loggable agents created successfully!')
	} catch (error) {
		console.error(`Creating loggable agents failed! (${error})`)
	}
}

const createCustomers = async (number = 50) => {
	console.log('Creating customers...')
	if (typeof number !== 'number')
		throw new Error(`number must be a number! (got ${typeof number})`)

	for (const _ of Array.from(Array(number).keys())) {
		try {
			const firstname = faker.name.firstName()
			const lastname = faker.name.lastName()

			const email = faker.helpers.unique(faker.internet.email, [
				firstname.toLowerCase(),
				lastname.toLowerCase()
			])

			const timestamps = faker.date.between(
				moment().subtract(30, 'days').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')
			)

			await User({
				firstname,
				lastname,
				email,
				password: await bcrypt.hash(
					faker.internet.password(15, true, /[a-zA-Z0-9]/),
					10
				),
				ref: faker.helpers.unique(faker.database.mongodbObjectId),
				createdAt: timestamps,
				updatedAt: timestamps
			}).save()
			console.log('Customer created successfully!')
		} catch (error) {
			console.error(`Creating Customer failed! (${error})`)
		}
	}
	console.log('All Customers created successfully!')
}
const createAgents = async (number = 5) => {
	console.log('Creating agents...')

	if (typeof number !== 'number') process.exit(1)

	for (const _ of Array.from(Array(number).keys())) {
		try {
			const firstname = faker.name.firstName()
			const lastname = faker.name.lastName()

			const email = faker.helpers.unique(faker.internet.email, [
				firstname.toLowerCase(),
				lastname.toLowerCase()
			])

			const timestamps = faker.date.between(
				moment().subtract(30, 'days').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')
			)

			await User({
				firstname,
				lastname,
				email,
				password: await bcrypt.hash(
					faker.internet.password(15, true, /[a-zA-Z0-9]/),
					10
				),
				role: 'agent',
				ref: faker.helpers.unique(faker.database.mongodbObjectId),
				agent: { phonePro: faker.helpers.unique(faker.phone.number) },
				createdAt: timestamps,
				updatedAt: timestamps
			}).save()
			console.log('Agent created successfully!')
		} catch (error) {
			console.error(`Creating Agent failed! (${error})`)
		}
	}
	console.log('All Agents created successfully!')
}

const seedUsers = async () => {
	console.log('Seeding Users...')
	try {
		await createLoggableCustomers()
		await createLoggableAgents()
		await createCustomers()
		await createAgents()

		console.log('Users created')
	} catch (error) {
		console.error(error)
	}
}

const destroyUsers = async () => {
	console.log('Destroying Users...')
	try {
		const { deletedCount } = await User.deleteMany()

		console.log(`${deletedCount} Users deleted successfully!`)
	} catch (error) {
		console.error(`Users deletion failed : ${error}`)
	}
}

const resetUsers = async () => {
	console.log('Resetting Users...')
	try {
		await destroyUsers()
		await seedUsers()

		console.log('Users reset successfully!')
	} catch (error) {
		console.error(`Properties reset failed : ${error}`)
		throw error
	}
}

export { seedUsers, destroyUsers, resetUsers }
