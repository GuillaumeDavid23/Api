import req from 'supertest'
import API from '../../app.js'

const user_info = {
	email: 'b_rault@outlook.fr',
	password: 'Azertyuiop12',
}

describe('La UserRoutes', () => {
	it('peut récupérer tous les utilisateurs', (done) => {
		req(API).get('/api/user').expect(200, done)
	})

	describe('sur la partie Signup', () => {})

	describe('sur la partie Login', () => {
		it('Peut connecter un utilisater', (done) => {
			req(API).post('/api/user/login/').send(user_info).expect(200, done)
		})

		it('Renvoie une erreur 422 si email vide', (done) => {
			const user_info = {
				email: '',
				password: 'azertyuiop',
			}
			req(API).post('/api/user/login/').send(user_info).expect(422, done)
		})

		it('Renvoie une erreur 422 si mot de passe vide', (done) => {
			const user_info = {
				email: 'b_rault@oulook.fr',
				password: '',
			}
			req(API).post('/api/user/login/').send(user_info).expect(422, done)
		})
		it('Renvoie une erreur 401 si utilisateur inexistant', (done) => {
			const user_info = {
				email: 'b_rault@oulook.fr',
				password: 'Azertyuiop503',
			}
			req(API).post('/api/user/login/').send(user_info).expect(401, done)
		})
	})

	describe('sur la partie Tokens', () => {
		it("Renvoie un code 204 si le token n'est pas trouvé", (done) => {
			const token = 'azertyuiop'

			req(API)
				.get('/api/user/check/' + token)
				.expect(204, done)
		})

		it('Renvoie un code 200 si le token est trouvé', (done) => {
			const user_info = {
				email: 'b_rault@outlook.fr',
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

	describe('sur la partie Newsletter', () => {
		it.skip('Renvoie un code 400 sur un update sur utilisateur déjà inscrit', (done) => {
			const id_user = ''
			req(API)
				.get('/api/user/setNewsletter/' + id_user)
				.expect(400, done)
		})
	})
})
