import { expect } from 'chai'
import mongoose from 'mongoose'
import * as util from './util.js'

const global_id = new mongoose.Types.ObjectId()

const appointement_default = {
	dateBegin: '2022-01-01T10:00:00',
	dateEnd: '2022-01-01T10:30:00',
	address: '2 rue des escalopes, 69 777 Monquc',
	outdoor: true,
	id_agent: global_id,
	id_buyer: new mongoose.Types.ObjectId(),
	id_property: null,
}

describe("L'AppointementModel ", () => {
	var Appointment, dummy

	before((done) => {
		mongoose.connect(util.mongo_path)
		mongoose.connection.once('connected', () => {
			mongoose.connection.db.dropDatabase()

			import('../../models/Appointment.js')
				.then(({ default: AppointementModel }) => {
					Appointment = AppointementModel
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
		dummy = new Appointment({ ...appointement_default, address: 'dummy' })
		dummy
			.save()
			.then(() => done())
			.catch((err) => done(new Error(err.message)))
	})

	afterEach((done) => {
		mongoose.connection.collections.appointments.drop(() => done())
	})

	describe('peut ', () => {
		describe('via un CRUD ', () => {
			it('créer un rendez-vous', (done) => {
				const ap = new Appointment({ ...appointement_default })

				ap.save()
					.then(() => {
						try {
							done()
						} catch (error) {
							done(new Error(error.message))
						}
					})
					.catch((err) => {
						expect(err).not.to.exist
					})
			})

			it('récupérer un rendez-vous', (done) => {
				Appointment.findOne({ id_agent: global_id })
					.then((ap) => {
						expect(ap).to.exist
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('récupérer tous les rendez-vous', (done) => {
				Appointment.find()
					.then((list) => {
						expect(list).to.be.an.an('Array').that.is.not.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('modifier un rendez-vous', (done) => {
				Appointment.findOneAndUpdate(
					{ id_agent: global_id },
					{ address: 'nouvelle adresse' }
				)
					.then((ap) => {
						expect(ap).to.exist
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('supprimer un rendez-vous', (done) => {
				Appointment.findOneAndDelete({ id_agent: global_id })
					.then(() => {
						Appointment.find()
							.then((list) => {
								expect(list).to.be.an('Array').that.is.empty
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
		it('créer un rendez-vous sans date de début', (done) => {
			const ap = new Appointment({
				...appointement_default,
				dateBegin: '',
			})

			ap.save()
				.then(() => {
					done(
						new Error(
							'AppointmentModel::create> AppointmentModel can create without beginning date'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				})
		})

		it('créer un rendez-vous sans date de fin', (done) => {
			const ap = new Appointment({
				...appointement_default,
				dateEnd: '',
			})

			ap.save()
				.then(() => {
					done(
						new Error(
							'AppointmentModel::create> AppointmentModel can create without ending date'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				})
		})

		it('créer un rendez-vous sans adresse', (done) => {
			const ap = new Appointment({
				...appointement_default,
				address: '',
			})

			ap.save()
				.then(() => {
					done(
						new Error(
							'AppointmentModel::create> AppointmentModel can create without address'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				})
		})

		it('créer un rendez-vous sans statut extérieur', (done) => {
			const ap = new Appointment({
				...appointement_default,
				outdoor: null,
			})

			ap.save()
				.then(() => {
					done(
						new Error(
							'AppointmentModel::create> AppointmentModel can create without outdoor boolean'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				})
		})

		it('créer un rendez-vous sans id acheteur', (done) => {
			const ap = new Appointment({
				...appointement_default,
				id_buyer: null,
			})

			ap.save()
				.then(() => {
					done(
						new Error(
							'AppointmentModel::create> AppointmentModel can create without buyer id'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				})
		})

		it('créer un rendez-vous sans id agent', (done) => {
			const ap = new Appointment({
				...appointement_default,
				id_agent: null,
			})
			ap.save()
				.then(() => {
					done(new Error('Erreur id agent vide ici'))
				})
				.catch((err) => {
					try {
						expect(err).to.exist.and.be.instanceof(Error)
						done()
					} catch (error) {
						done(new Error(error))
					}
				})
		})
	})
})
