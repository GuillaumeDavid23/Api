import { expect } from 'chai'
import request from 'supertest'
import API from '../../app.js'

describe("L'API, ", () => {
	var app

	before((done) => {
		app = API.listen((err) => {
			if (err) {
				return done(new Error(err.message))
			}
			return done()
		})
	})

	after((done) => {
		app.close()
		done()
	})

	describe(' sur les utilisateurs ', () => {
		it('peut récupérer tous les utilisateurs', (done) => {
			request(API).get('/api/user/').expect(200, done)
		})
	})
})
