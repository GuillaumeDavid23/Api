import { faker } from '@faker-js/faker'
import Property from '../../models/Property.js'
import { getRandomIntInclusive as random } from '../../util/functions.js'

// Set lang to French
faker.setLocale('fr')

const createProperties = async (number = 15) => {
	console.log('Creating properties...')

	// If number not 'number', throw Error
	if (typeof number !== 'number')
		throw new Error(
			`PropertySeeder:createProperties> argument must be a number (got ${typeof number})`
		)

	// Try creating all properties
	for (const _ of Array.from(Array(number).keys())) {
		try {
			await Property({
				title: faker.lorem.words(random(1, 3)),
				description: faker.lorem.lines(random(1, 10)),
				amount:
					Math.round(faker.finance.amount(10000, 500000) / 1000) *
					1000,
				location: [
					faker.address.street(),
					faker.address.zipCode(),
					faker.address.city(),
					'France'
				],
				propertyType: faker.helpers.arrayElement([
					'Maison',
					'Appartement'
				]),
				surface: faker.datatype.number({ min: 20, max: 200 }),
				roomNumber: faker.datatype.number({ min: 1, max: 10 }),
				transactionType: faker.helpers.arrayElement([
					'Achat',
					'Location'
				]),
				isToSell: faker.datatype.boolean(),
				propertyRef: faker.helpers.unique(
					faker.database.mongodbObjectId
				),
				verified: faker.datatype.boolean()
			}).save()

			console.log('Properties created successfully!')
		} catch (error) {
			console.error(`Creating property failed! (${error})`)
		}
	}
	console.log('All Properties created successfully!')
}

const seedProperties = async () => {
	console.log(`Seeding Properties...`)
	try {
		await createProperties()
		console.log(`Properties seeded successfully!`)
	} catch (error) {
		console.error(`Seeding Properties failed : ${error}`)
	}
}

const destroyProperties = async () => {
	console.log(`Deleting properties...`)

	try {
		const { deletedCount } = await Property.deleteMany()

		console.log(`${deletedCount} Properties deleted successfully!`)
	} catch (error) {
		console.error(`Properties deletion failed : ${error}`)
	}
}

const resetProperties = async () => {
	try {
		console.log('Resetting properties...')
		await destroyProperties()
		await seedProperties()
		console.log('Properties reset successfully!')
	} catch (error) {
		console.error(`Properties reset failed : ${error}`)
		throw error
	}
}

export { seedProperties, destroyProperties, resetProperties }
