import { expect } from 'chai'
import mongoose from 'mongoose'
import * as util from '../util.js'

mongoose.Promise = global.Promise

const global_id = new mongoose.Types.ObjectId()

const inventory_default = {
	id_agent: global_id,
	id_rental: new mongoose.Types.ObjectId(),
	inOut: true,
	userReference: 'USER00001',
	keyNumber: 3,
	date: '2022-01-01T10:00:00',
	previousBuyerRef: 'USER0000',
	lst_statsMeters: [],
	lst_roomDetails: [],
}

describe("L'InventoryModel", () => {
	var Inventory, dummy

	before((done) => {
		mongoose.connection
			.close()
			.then()
			.catch((err) => console.log(err))
		mongoose.connect(util.mongo_path)
		mongoose.connection.once('connected', () => {
			mongoose.connection.db.dropDatabase()

			import('../../models/Inventory.js')
				.then(({ default: InventoryModel }) => {
					Inventory = InventoryModel
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
		dummy = new Inventory({ ...inventory_default })
		dummy
			.save()
			.then(() => done())
			.catch((err) => {
				done(new Error(err.message))
			})
	})

	afterEach((done) => {
		mongoose.connection.collections.inventories.drop(() => done())
	})

	describe('peut', () => {
		describe('via un CRUD', () => {
			it('créer un état des lieux', (done) => {
				const i = new Inventory({ ...inventory_default })

				i.save()
					.then(() => {
						done()
					})
					.catch((err) => {
						expect(err).not.to.exist
						done(new Error(err.message))
					})
			})
			it('récupérer un état des lieux', (done) => {
				Inventory.findOne({ id_agent: global_id })
					.then((i) => {
						expect(i).to.exist.and.not.to.be.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('récupérer tous les états des lieux', (done) => {
				Inventory.find()
					.then((list) => {
						expect(list).to.be.an('Array').that.is.not.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('modifier un état des lieux', (done) => {
				Inventory.findOneAndUpdate(
					{ id_agent: global_id },
					{ userReference: 'USER0002' },
					{ new: true }
				)
					.then((i) => {
						expect(i).to.exist.and.not.to.be.empty
						expect(i.userReference).to.eq('USER0002')
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('Supprimer un état des lieux', (done) => {
				Inventory.findOneAndDelete({ id_agent: global_id })
					.then(() => {
						Inventory.find()
							.then((l) => {
								expect(l).to.be.an('Array').that.is.empty
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

	describe('ne peut pas', () => {
		it('créer un état des lieux sans id agent', (done) => {
			const i = new Inventory({ ...inventory_default, id_agent: null })

			i.save((err) => {
				if (err) {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				} else {
					done(
						new Error(
							'InventoryModel::create>Can create without id_agent'
						)
					)
				}
			})
		})
		it('créer un état des lieux sans id location', (done) => {
			const i = new Inventory({ ...inventory_default, id_rental: null })

			i.save((err) => {
				if (err) {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				} else {
					done(
						new Error(
							'InventoryModel::create>Can create without id_rental'
						)
					)
				}
			})
		})
		it("créer un état des lieux sans booléen d'entrée ou sortie", (done) => {
			const i = new Inventory({ ...inventory_default, inOut: null })

			i.save((err) => {
				if (err) {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				} else {
					done(
						new Error(
							'InventoryModel::create>Can create without inOut'
						)
					)
				}
			})
		})
		it('créer un état des lieux sans référence client', (done) => {
			const i = new Inventory({
				...inventory_default,
				userReference: null,
			})

			i.save((err) => {
				if (err) {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				} else {
					done(
						new Error(
							'InventoryModel::create>Can create without userReference'
						)
					)
				}
			})
		})
		it('créer un état des lieux sans date', (done) => {
			const i = new Inventory({ ...inventory_default, date: '' })

			i.save((err) => {
				if (err) {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				} else {
					done(
						new Error(
							'InventoryModel::create>Can create without date'
						)
					)
				}
			})
		})
		it('créer un état des lieux sans listes de détails des pièces', (done) => {
			const i = new Inventory({
				...inventory_default,
				lst_roomDetails: null,
			})

			i.save((err) => {
				if (err) {
					expect(err).to.exist.and.to.be.instanceof(Error)
					done()
				} else {
					done(
						new Error(
							'InventoryModel::create>Can create without lst_roomDetails'
						)
					)
				}
			})
		})
	})
})
