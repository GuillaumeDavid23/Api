import req from 'supertest'
import API from '../../app.js'

describe.skip('La RentalRoute ', () => {
	describe(' oui ', () => {
		it('peut récupérer tous les utilisateurs', (done) => {
			req(API).get('/api/rental').expect(200, done)
		})
	})
})
