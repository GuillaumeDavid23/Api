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
		it("WIP - afficher un utilisateur à partir d'un body vide", (done) => {
			done()
		})
	})
})
