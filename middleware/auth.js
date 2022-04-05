import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export default (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
		const user = decodedToken.user
		req.auth = { user }
		// if (req.body.userId && req.body.userId !== user.Id) {
		// 	throw 'User ID non valable !'
		// } else {
		// 	next()
		// }
		next()
	} catch (error) {
		res.status(401).json({
			error: error.message || 'Requête non authentifiée !',
		})
	}
}
