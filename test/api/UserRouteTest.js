import req from 'supertest'
import API from '../../app.js'

import mongoose from 'mongoose'

import * as util from '../util.js'
import * as bcrypt from 'bcrypt'

import * as Ut from '../mockedUser.js'
import { expect } from 'chai'

mongoose.Promise = global.Promise

const saltRounds = 10

describe('La UserRoutes', () => {
	var User,
		BASE_URL = '/api/user/'

	before((done) => {
		mongoose.connection.collections.users.drop((err) => {
			err ? done(new Error(err.message)) : null
		})

		import('../../models/User.js')
			.then(({ default: UserModel }) => {
				User = UserModel
				done()
			})
			.catch((err) => done(new Error(err.message)))
	})

	after((done) => {
		done()
	})

	beforeEach((done) => {
		let ok = new User({ ...Ut.tmp_user_ok })
		let pasconfirme = new User({ ...Ut.tmp_user_pasconfirme })
		let desac = new User({ ...Ut.tmp_user_desac })

		bcrypt.hash('Dummydummy69', saltRounds, (err, hash) => {
			ok.password = hash
			pasconfirme.password = hash
			desac.password = hash

			try {
				ok.save((err) => {
					err ? done(new Error(err.message)) : null
				})
				pasconfirme.save((err) => {
					err ? done(new Error(err.message)) : null
				})
				desac.save((err) => {
					err ? done(new Error(err.message)) : null
				})
				done()
			} catch (error) {
				done(new Error(error.message))
			}
		})
	})

	afterEach((done) => {
		mongoose.connection.collections.users.drop(() => done())
	})

	describe('sur la partie Login', () => {
		const api_path = BASE_URL + 'login'

		it('Renvoie une erreur 422 si email vide', (done) => {
			const user_info = {
				email: '',
				password: 'azertyuiop',
			}
			req(API).post(api_path).send(user_info).expect(422, done)
		})

		it('Renvoie une erreur 422 si mot de passe vide', (done) => {
			const user_info = {
				email: 'b_rault@oulook.fr',
				password: '',
			}
			req(API).post(api_path).send(user_info).expect(422, done)
		})

		it('Renvoie un succès 200 pour un utilisateur existant', (done) => {
			const user_info = {
				email: Ut.tmp_user_ok.email,
				password: Ut.tmp_user_ok.password,
			}

			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(200)
					expect(res.body).to.exist.and.have.property(
						'message',
						'Utilisateur connecté !'
					)
					done()
				})
		})

		it("Renvoie une erreur 403 si l'utilisateur n'a pas activé son compte", (done) => {
			const user_info = {
				email: Ut.tmp_user_pasconfirme.email,
				password: Ut.tmp_user_pasconfirme.password,
			}

			console.log(user_info)

			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					console.log(res.body)
					expect(res.status).to.eq(403)
					expect(res.body).to.exist.and.have.property(
						'error',
						'Vérification par email nécessaire.'
					)
					done()
				})
		})

		it("Renvoie une erreur 403 si l'utilisateur est désactivé", (done) => {
			const user_info = {
				email: Ut.tmp_user_desac.email,
				password: Ut.tmp_user_desac.password,
			}
			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(403)
					expect(res.body).to.exist.and.have.property(
						'error',
						'Compte utilisateur désactivé.'
					)
					done()
				})
		})

		it('Renvoie une erreur 401 si utilisateur inexistant', (done) => {
			const user_info = {
				email: 'b_rault@oulook.fr',
				password: 'Azertyuiop503',
			}
			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(401)
					expect(res.body).to.exist.and.to.have.property(
						'error',
						'Utilisateur non trouvé !'
					)
					done()
				})
		})

		it("Renvoie une erreur 401 si l'utilisateur n'entre pas le bon mot de passe", (done) => {
			const user_info = {
				email: 'ok@dummy.com',
				password: 'Azertyuiop69',
			}
			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(401)
					expect(res.body).to.exist.and.to.have.property(
						'error',
						'Mot de passe incorrect !'
					)

					done()
				})
		})
	})

	describe.skip('sur la partie Signup', () => {
		before((done) => {
			mongoose.connection.collections.users.drop(() => done())
		})
		after((done) => {
			mongoose.connection.collections.users.drop(() => done())
		})

		describe('Inscription Vendeur', () => {
			it('Renvoie un code 201 sur un nouveau vendeur OK', (done) => {
				const api_path = BASE_URL + 'sellerSignup'

				req(API)
					.post(api_path)
					.send(Ut.tmp_seller_acreer)
					.end((err, res) => {
						expect(res.status).to.eq(201)
						expect(res.body).to.exist.and.to.have.property(
							'message',
							'Compte créé !'
						)
						err ? done(new Error(err.message)) : done()
					})
			})
		})
		describe('Inscription Acheteur', () => {
			const api_path = BASE_URL + 'buyerSignup'
			var user_info = { ...Ut.tmp_buyer_acreer }
			it('créer un nouvel acheteur', (done) => {
				req(API)
					.post(api_path)
					.send(user_info)
					.end((err, res) => {
						expect(res.status).to.eq(201)
						expect(res.body).to.exist.and.to.have.property(
							'message',
							'Compte créé !'
						)
						done()
					})
			})
		})
	})

	describe.skip('sur la partie Mot de Passe oublié', () => {
		const api_path = BASE_URL + 'forgot'
		it("Renvoie un code 403 si l'utilisateur est désactivé", (done) => {
			const user_info = {
				email: Ut.tmp_user_desac.email,
			}
			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(403)
					expect(res.body).to.exist.and.to.have.property(
						'error',
						'Compte utilisateur désactivé !'
					)
					done()
				})
		})

		it('Renvoie un code 200 si OK', (done) => {
			const user_info = {
				email: Ut.tmp_user_ok.email,
			}
			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(200)
					expect(res.body).to.exist.and.to.have.property(
						'message',
						'Email de réinitialisation envoyé.'
					)
					done()
				})
		})
	})

	describe.skip('sur la partie Tokens', () => {
		it("Renvoie un code 204 si le token n'est pas trouvé", (done) => {
			const token = 'azertyuiop'

			req(API)
				.get('/api/user/check/' + token)
				.expect(204, done)
		})

		it('Renvoie un code 200 si le token est trouvé', (done) => {
			const user_info = {
				email: 'ouioui@nonnon.fr',
				password: 'Azertyuiop12',
			}
			req(API)
				.post('/api/user/login/')
				.send(user_info)
				.then((res) => {
					const { token } = res.body

					req(API)
						.get('/api/user/check/' + token)
						.expect(200, done)
				})
		})
	})

	describe.skip('sur la partie Newsletter', () => {
		it.skip('Renvoie un code 400 sur un update sur utilisateur déjà inscrit', (done) => {
			const id_user = ''
			req(API)
				.get('/api/user/setNewsletter/' + id_user)
				.expect(400, done)
		})
	})
})
