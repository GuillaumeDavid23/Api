import { expect } from 'chai'
import * as sinon from 'sinon'
import * as mock from 'mock-req-res'

import * as UserController from '../../controllers/user.js'

describe('Le UserController', () => {
	// var status, json, res
	var req, res

	beforeEach((done) => {
		req = mock.mockRequest()
		res = mock.mockResponse()

		done()
	})

	describe('ne peut pas', () => {
		it("afficher un utilisateur à partir d'un body vide", (done) => {
			req.body = {
				email: 'aaaaaaaaaa',
				password: 'aaaaaaaaaa',
			}
			UserController.login(req, res)
				.then(() => {
					const { status_code, error } = res.json.args[0][0]

					expect(res.status.calledOnce).to.be.true

					expect(status_code).to.eq(401)

					console.log(status_code)
					console.log(error)

					done()
				})
				.catch((err) => {
					done(new Error(err.message))
				})
		})
	})
})
