import req from 'supertest'
import API from '../../app.js'

describe('La RentalRoute ', () => {
	after((done) => {
		done()
	})
	describe('ne peut pas', () => {
		it("récupérer tous les utilisateurs sans token d'accès", (done) => {
			req(API).get('/api/rental').expect(401, done)
		})
	})
})
