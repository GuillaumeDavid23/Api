import req from 'supertest'
import API from '../../app.js'

describe('La UserRoutes ', () => {
	describe(' oui ', () => {
		it('peut récupérer tous les utilisateurs', (done) => {
			req(API).get('/api/user').expect(200, done)
		})
	})
})
