import req from 'supertest'
import API from '../../app.js'

import mongoose from 'mongoose'

import * as util from '../util.js'
import * as bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

import * as Ut from '../mockedUser.js'
import { expect } from 'chai'

import dotenv from 'dotenv'
dotenv.config()

mongoose.Promise = global.Promise

const saltRounds = 10

describe('La UserRoutes', () => {
	var User,
		BASE_URL = '/api/user/'

	before((done) => {
		mongoose.connection
			.close()
			.then()
			.catch((err) => console.log(err))
		mongoose.connect(util.mongo_path)

		mongoose.connection.once('connected', () => {
			mongoose.connection.db.dropDatabase()

			import('../../models/User.js')
				.then(({ default: UserModel }) => {
					User = UserModel
					done()
				})
				.catch((err) => done(new Error(err.message)))
		})
	})

	beforeEach((done) => {
		let ok = new User({ ...Ut.tmp_user_ok })
		let pasconfirme = new User({ ...Ut.tmp_user_pasconfirme })
		let desac = new User({ ...Ut.tmp_user_desac })

		bcrypt.hash('Dummydummy69', saltRounds, async (err, hash) => {
			ok.password = hash
			pasconfirme.password = hash
			desac.password = hash

			try {
				await ok.save()
				await pasconfirme.save()
				await desac.save()
				done()
			} catch (error) {
				done(new Error(error.message))
			}
		})
	})

	afterEach((done) => {
		mongoose.connection.collections.users.drop(() => done())
	})

	after((done) => {
		mongoose.disconnect()
		done()
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

			req(API)
				.post(api_path)
				.send(user_info)
				.end((err, res) => {
					expect(res.status).to.eq(403)
					expect(res.body).to.exist.and.have.property(
						'error',
						'Vous devez vérifier votre email.'
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

	describe('sur la partie Signup', () => {
		it('créer un nouvel utilisateur', (done) => {
			const api_path = BASE_URL + 'signup'
			var user_info = {
				...Ut.tmp_user_acreer,
				_id: new mongoose.Types.ObjectId(),
			}
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

	it("Renvoie un code 403 si l'utilisateur est désactivé", (done) => {
		const api_path = BASE_URL + 'forgot'
		const user_info = {
			email: Ut.tmp_user_desac.email,
		}
		req(API)
			.post(api_path)
			.send(user_info)
			.end((err, res) => {
				expect(res.status).to.eq(403)
				expect(res.body).to.exist.and.to.have.property(
					'message',
					'Compte utilisateur désactivé !'
				)
				done()
			})
	})

	it.skip('Renvoie un code 200 si OK', (done) => {
		const api_path = BASE_URL + 'forgot'
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

	it("Renvoie un code 401 si le token n'est pas correct", (done) => {
		const token = 'azertyuiop'

		req(API)
			.post('/api/user/checkBearer/')
			.set('Authorization', `bearer ${token}`)
			.expect(401, done)
	})

	it('Renvoie un code 200 si le token est trouvé', (done) => {
		req(API)
			.post('/api/user/checkBearer/')
			.set('Authorization', `bearer ${Ut.tmp_user_ok_token}`)
			.expect(200, done)
	})
})
