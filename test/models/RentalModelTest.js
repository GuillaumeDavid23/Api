import mongoose from 'mongoose'
import { expect } from 'chai'
import { mongo_path } from '../util.js'

mongoose.Promise = global.Promise

const global_id = new mongoose.Types.ObjectId()

const rental_default = {
	startDate: '2022-01-01T10:00:00',
	endDate: '2022-02-01T10:00:00',
	effectiveEndDate: '2022-02-01T10:00:00',
	amount: 500,
	status: true,
	keysNumber: 2,
	id_property: global_id,
	id_buyers: [],
	id_inventories: [],
}

describe('Le RentalModel ', () => {
	var Rental, dummy

	before((done) => {
		mongoose.connect(mongo_path)
		mongoose.connection.once('connected', () => {
			mongoose.connection.db.dropDatabase()

			import('../../models/Rental.js')
				.then(({ default: RentalModel }) => {
					Rental = RentalModel
					done()
				})
				.catch((err) => {
					done(new Error(err.message))
				})
		})
	})

	after((done) => {
		mongoose.disconnect()
		done()
	})

	beforeEach((done) => {
		dummy = new Rental({ ...rental_default })
		dummy
			.save()
			.then(() => done())
			.catch((err) => {
				done(new Error(err.message))
			})
	})

	afterEach((done) => {
		mongoose.connection.collections.rentals.drop(() => done())
	})

	describe('peut ', () => {
		describe('via un CRUD ', () => {
			it('créer une nouvelle location', (done) => {
				const r = new Rental({ ...rental_default })

				r.save()
					.then(() => {
						done()
					})
					.catch((err) => {
						expect(err).not.to.exist
						done(new Error(err.message))
					})
			})

			it('récupérer toutes les locations', (done) => {
				Rental.find()
					.exec()
					.then((rental_list) => {
						expect(rental_list).to.be.an('Array').and.not.to.be
							.empty

						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})

			it('récupérer une location', (done) => {
				Rental.findOne({ id_property: global_id })
					.exec()
					.then((rental) => {
						expect(rental).to.be.an('Object').and.not.to.be.empty

						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('modifier une location', (done) => {
				Rental.findOneAndUpdate(
					{ id_property: global_id },
					{ amount: 800 }
				)
					.then((rental) => {
						// expect(rental).to.be.an('Object').and.not.to.be.empty

						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('supprimer une location', (done) => {
				Rental.findOneAndDelete({ id_property: global_id })
					.then(() => {
						Rental.find()
							.then((rental_list) => {
								expect(rental_list).to.be.an('Array').that.is
									.empty
								done()
							})
							.catch((err) => {
								done(new Error(err.message))
							})
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
		})
	})

	describe('ne peut pas ', () => {
		it('créer une annonce sans date de début', () => {
			const r = new Rental({ ...rental_default, startDate: '' })

			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without starting date'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.an.instanceof(Error)
					done()
				})
		})

		it('créer une annonce sans date de fin', () => {
			const r = new Rental({ ...rental_default, endDate: '' })

			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without ending date'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.an.instanceof(Error)
					done()
				})
		})

		it.skip('créer une annonce sans date de fin effective', () => {
			const r = new Rental({ ...rental_default, effectiveEndDate: '' })

			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without effective ending date'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.an.instanceof(Error)
					done()
				})
		})

		it('créer une annonce sans statut', () => {
			const r = new Rental({ ...rental_default, status: null })
			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without status'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.an.instanceof(Error)
					done()
				})
		})

		it('créer une annonce sans nombre de clés', () => {
			const r = new Rental({ ...rental_default, keysNumber: null })
			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without keys number'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.an.instanceof(Error)
					done()
				})
		})

		it('créer une annonce sans id de propriété', () => {
			const r = new Rental({ ...rental_default, id_propriety: null })
			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without property id'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.an.instanceof(Error)
					done()
				})
		})

		it('créer une annonce sans id de propriété', () => {
			const r = new Rental({ ...rental_default, id_buyers: null })
			r.save()
				.then(() => {
					done(
						new Error(
							'RentalModel::create> Create Rental without buyers id'
						)
					)
				})
				.catch((err) => {
					expect(err).not.to.exist.and.be.an.instanceof(Error)
					done()
				})
		})
	})
})
