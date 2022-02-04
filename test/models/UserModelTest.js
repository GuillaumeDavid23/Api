import mongoose from 'mongoose'
import { expect } from 'chai'

mongoose.Promise = global.Promise

const mongo_path = 'mongodb://127.0.0.1:27017/amaizon_test'

const user_default = {
	firstname: 'Testeur',
	lastname: 'testouille',
	email: 'test@test.test',
	password: 'test',
	token: '',
	phone: '0712121269',
	newsletter: false,
	status: false,
	ref: 'testeur',
}

describe('Le model User', () => {
	var User, dummy

	before((done) => {
		mongoose.connect(mongo_path)
		mongoose.connection.once('connected', () => {
			mongoose.connection.db.dropDatabase()

			import('../../models/User.js')
				.then(({ default: UserModel }) => {
					User = UserModel
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
		dummy = new User({ ...user_default, ref: 'dummy' })
		dummy.save().then(() => done())
	})

	afterEach((done) => {
		mongoose.connection.collections.users.drop(() => done())
	})

	// Success Functions
	describe('peut', () => {
		describe.skip('via un CRUD', () => {
			it('créer un utilisateur basique', (done) => {
				const u = new User({ ...user_default })
				u.save()
					.then(() => {
						done()
					})
					.catch((error) => {
						expect(error).not.to.exist
						done(new Error(error))
					})
			})

			it('récupérer un utilisateur', (done) => {
				User.findOne({ ref: 'dummy' })
					.exec()
					.then((user) => {
						expect(user).to.be.an('Object')
						expect(user).to.not.be.empty

						done()
					})
					.catch((error) => {
						expect(error).not.to.exist
						done(new Error(error))
					})
			})

			it('récupérer tous les utilisateurs', (done) => {
				User.find()
					.then((user_list) => {
						try {
							expect(user_list).to.be.an('Array').that.is.not
								.empty
							done()
						} catch (error) {
							done(new Error(error))
						}
					})
					.catch((error) => {
						expect(error).not.to.exist

						done(new Error(error))
					})
			})

			it('modifier un utilisateur (via son prénom)', (done) => {
				User.findOneAndUpdate(
					{ ref: 'dummy' },
					{ firstname: 'Autre nom' }
				)
					.exec()
					.then((user) => {
						done()
					})
			})

			it('supprime un utilisateur', (done) => {
				User.findOneAndDelete({ ref: 'dummy' }).then(() => {
					User.find()
						.then((user_list) => {
							expect(user_list).to.be.an('Array').that.is.empty
							done()
						})
						.catch((error) => {
							done(new Error(error))
						})
						.catch((error) => {
							done(new Error(error))
						})
				})
			})
		})
	})

	// Throwing Errors
	describe('ne peut pas', () => {
		it("créer d'utilisateur basique sans prénom", (done) => {
			const u = new User({ ...user_default, firstname: '' })

			u.save((error) => {
				expect(error)
					.to.exist.and.be.instanceof(Error)
					.and.have.property(
						'message',
						'User validation failed: firstname: Path `firstname` is required.'
					)
				done()
			})
		})

		it("créer d'utilisateur basique sans nom de famille", (done) => {
			const u = new User({ ...user_default, lastname: '' })

			u.save((error) => {
				expect(error)
					.to.exist.and.be.instanceof(Error)
					.and.have.property(
						'message',
						'User validation failed: lastname: Path `lastname` is required.'
					)
				done()
			})
		})

		it("créer d'utilisateur basique sans mot de passe", (done) => {
			const u = new User({ ...user_default, password: '' })

			u.save((error) => {
				expect(error)
					.to.exist.and.be.instanceof(Error)
					.and.have.property(
						'message',
						'User validation failed: password: Path `password` is required.'
					)
				done()
			})
		})

		it("créer d'utilisateur basique sans email", (done) => {
			const u = new User({ ...user_default, email: '' })

			u.save((error) => {
				expect(error)
					.to.exist.and.be.instanceof(Error)
					.and.have.property(
						'message',
						'User validation failed: email: Path `email` is required.'
					)
				done()
			})
		})

		it("créer d'utilisateur basique sans statut", (done) => {
			const u = new User({ ...user_default, status: '' })

			u.save((error) => {
				expect(error)
					.to.exist.and.be.instanceof(Error)
					.and.have.property(
						'message',
						'User validation failed: status: Path `status` is required.'
					)
				done()
			})
		})
	})
})
