import { expect } from 'chai'
import mongoose from 'mongoose'
import * as util from '../util.js'

mongoose.Promise = global.Promise

const property_default = {
	title: 'titre',
	description: 'description',
	amount: 100000,
	location: "69 rue d'ailleurs",
	propertyType: 'maison',
	surface: 100,
	roomNumber: 5,
	transactionType: 'achat',
	list_equipments: [],
	list_heater: [],
	list_water: [],
	electricMeterRef: 'ELEC0001',
	gasMeterRef: 'GAZ0001',
	isToSell: true,
	propertyRef: 'REF0001',
	imageUrl: 'REF0001_IMG01',

	buyers: [],
	wishers: [],
}

describe('Le PropertyModel', () => {
	var Property, dummy

	before((done) => {
		mongoose.connection
			.close()
			.then()
			.catch((err) => console.log(err))
		mongoose.connect(util.mongo_path)
		mongoose.connection.once('connected', () => {
			mongoose.connection.db.dropDatabase()

			import('../../models/Property.js').then(
				({ default: PropertyModel }) => {
					Property = PropertyModel
					done()
				}
			)
		})
	})

	after((done) => {
		mongoose.disconnect()
		done()
	})

	beforeEach((done) => {
		dummy = new Property({ ...property_default, propertyRef: 'dummy' })
		dummy.save().then(() => done())
	})

	afterEach((done) => {
		mongoose.connection.collections.properties.drop(() => done())
	})

	describe('peut', () => {
		describe('via un CRUD', () => {
			it('créer une propriété', (done) => {
				const p = new Property({ ...property_default })

				p.save((err) => {
					expect(err).not.to.exist
					done()
				})
			})
			it('récupérer une propriété', (done) => {
				Property.findOne({ propertyRef: 'dummy' })
					.then((p) => {
						expect(p).to.exist.and.not.be.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('récupérer toutes les propriétés', (done) => {
				Property.find()
					.then((list) => {
						expect(list).to.be.an('Array').that.is.not.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('Modifier propriété', (done) => {
				Property.findOneAndUpdate(
					{ propertyRef: 'dummy' },
					{ amount: 200000 },
					{ new: true }
				)
					.then((p) => {
						expect(p).to.exist
						expect(p.amount).to.equal(200000)

						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('récupérer une propriété', (done) => {
				Property.findOneAndDelete({ propertyRef: 'dummy' })
					.then(() => {
						Property.find().then((list) => {
							expect(list).to.be.an('Array').that.is.empty
							done()
						})
					})

					.catch((err) => {
						done(new Error(err.message))
					})
			})
		})
	})

	describe('ne peut pas', () => {
		it('créer une propriété sans titre', (done) => {
			const p = new Property({ ...property_default, title: '' })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without title'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans montant', (done) => {
			const p = new Property({ ...property_default, amount: null })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without amount'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans localisation', (done) => {
			const p = new Property({ ...property_default, location: null })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without location'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans type de propriété', (done) => {
			const p = new Property({ ...property_default, propertyType: '' })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without propertyType'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans surface', (done) => {
			const p = new Property({ ...property_default, surface: null })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without surface'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans nombre de pièce', (done) => {
			const p = new Property({ ...property_default, roomNumber: null })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without roomNumber'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans type de transaction', (done) => {
			const p = new Property({ ...property_default, transactionType: '' })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without transactionType'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it("créer une propriété sans booléen d'état de vente", (done) => {
			const p = new Property({ ...property_default, isToSell: null })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without isToSell'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété sans référence de bien', (done) => {
			const p = new Property({ ...property_default, propertyRef: '' })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without propertyRef'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
		it('créer une propriété avec attribut Verified à null', (done) => {
			const p = new Property({ ...property_default, verified: null })

			p.save((err) => {
				if (!err)
					done(
						new Error(
							'PropertyModel::create>Can create without verified'
						)
					)
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
	})
})
