import { expect } from 'chai'
import mongoose from 'mongoose'
import * as util from '../util.js'

mongoose.Promise = global.Promise

const global_id = new mongoose.Types.ObjectId()

const transaction_default = {
	id_agent: global_id,
	id_property: new mongoose.Types.ObjectId(),
	lst_buyer: [],
	lst_seller: [],
	amount: 500,
	date: '2022-01-01T10:00:00',
	status: true,
}

describe('Le TransactionModel', () => {
	var Transaction, dummy

	before((done) => {
		mongoose.connect(util.mongo_path)
		mongoose.connection.once('connected', () => {
			mongoose.connection.dropDatabase()

			import('../../models/Transaction.js')
				.then(({ default: TransactionModel }) => {
					Transaction = TransactionModel
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
		dummy = new Transaction({ ...transaction_default })
		dummy.save().then(() => done())
	})

	afterEach((done) => {
		mongoose.connection.collections.transactions.drop(() => done())
	})

	describe('peut', () => {
		describe('via un CRUD', () => {
			it('créer une transaction', (done) => {
				const t = new Transaction({ ...transaction_default })

				t.save()
					.then(() => {
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('récupérer une transaction', (done) => {
				Transaction.findOne({ id_agent: global_id })
					.then((t) => {
						expect(t).to.exist.and.not.to.be.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('toutes les transactions', (done) => {
				Transaction.find()
					.then((li) => {
						expect(li).to.be.an('Array').that.is.not.empty
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('modifier une transaction', (done) => {
				Transaction.findOneAndUpdate(
					{ id_agent: global_id },
					{ amount: 1000 }
				)
					.then(() => {
						done()
					})
					.catch((err) => {
						done(new Error(err.message))
					})
			})
			it('Supprimer une transaction', (done) => {
				Transaction.findOneAndDelete({ id_agent: global_id }).then(
					() => {
						Transaction.find()
							.then((li) => {
								expect(li).to.be.an('Array').that.is.empty
								done()
							})
							.catch((err) => {
								done(new Error(err.message))
							})
					}
				)
			})
		})
	})

	describe('ne peut pas', () => {
		it('créer de transaction sans id agent', (done) => {
			const t = new Transaction({
				...transaction_default,
				id_agent: null,
			})

			t.save()
				.then(() => {
					done(
						new Error(
							'TransactionModel::create> can create without id_agent'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.instanceof(Error)
					done()
				})
		})
		it('créer de transaction sans id propriété', (done) => {
			const t = new Transaction({
				...transaction_default,
				id_property: null,
			})

			t.save()
				.then(() => {
					done(
						new Error(
							'TransactionModel::create> can create without id_property'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.instanceof(Error)
					done()
				})
		})
		it("créer de transaction sans liste d'acheteurs", (done) => {
			const t = new Transaction({
				...transaction_default,
				lst_buyer: null,
			})

			t.save()
				.then(() => {
					done(
						new Error(
							'TransactionModel::create> can create without lst_buyer'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.instanceof(Error)
					done()
				})
		})
		it('créer de transaction sans liste de vendeurs', (done) => {
			const t = new Transaction({
				...transaction_default,
				lst_seller: null,
			})

			t.save()
				.then(() => {
					done(
						new Error(
							'TransactionModel::create> can create without lst_seller'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.instanceof(Error)
					done()
				})
		})
		it('créer de transaction sans montant', (done) => {
			const t = new Transaction({ ...transaction_default, amount: null })

			t.save()
				.then(() => {
					done(
						new Error(
							'TransactionModel::create> can create without amount'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.instanceof(Error)
					done()
				})
		})
		it('créer de transaction sans date', (done) => {
			const t = new Transaction({ ...transaction_default, date: '' })

			t.save()
				.then(() => {
					done(
						new Error(
							'TransactionModel::create> can create without date'
						)
					)
				})
				.catch((err) => {
					expect(err).to.exist.and.be.instanceof(Error)
					done()
				})
		})

		it('créer une transaction avec un statut vide', (done) => {
			const t = new Transaction({ ...transaction_default, status: null })

			t.save((err) => {
				expect(err).to.exist.and.be.instanceof(Error)
				done()
			})
		})
	})
})
