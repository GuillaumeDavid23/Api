import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

//CREATE USER
const create = async (req, res) => {
	const saltRounds = 10
	delete req.body._id
	const user = new User({
		...req.body,
	})
	const mailCheck = await User.findOne({ email: user.email })
	if (mailCheck) {
		return res.status(403).json({
			error: 'Un compte avec cette adresse email existe déjà !',
		})
	}
	bcrypt.hash(user.password, saltRounds, function (err, hash) {
		user.password = hash
		user.save()
			.then(() =>
				res.status(201).json({
					message: 'Utilisateur créé !',
				})
			)
			.catch((error) =>
				res.status(400).json({
					error,
				})
			)
	})
}

//UPDATE USER
const update = (req, res) => {
	User.updateOne(
		{
			_id: req.params._id,
		},
		{
			...req.body,
		}
	)
		.then((response) => {
			res.status(201).json({
				message: 'Utilisateur modifié !',
			})
		})
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

//GET ONE USER
const getOne = async (req, res) => {
	try {
		const user = await User.findById(req.params._id)
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

//GET ALL USER
const getAll = async (req, res) => {
	try {
		const user = await User.find({ status: true })
		if (user) {
			res.status(200).json(user)
		} else {
			res.status(204).json({ message: 'Aucun utilisateur' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

//GET DELETE
const deleteOne = async (req, res) => {
	User.updateOne(
		{
			_id: req.params._id,
		},
		{
			status: 0,
		}
	)
		.then((response) => {
			res.status(201).json({
				message: 'Utilisateur désactivé !',
			})
		})
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

//SIGNUP USER
const signup = async (req, res) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				...req.body,
				password: hash,
			})
			user.save()
				.then(() =>
					res.status(201).json({
						message: 'Utilisateur créé !',
					})
				)
				.catch((error) =>
					res.status(400).json({
						error,
					})
				)
		})
		.catch((error) =>
			res.status(500).json({
				error,
			})
		)
}

//LOGIN USER
const login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		if (user.status == false) {
			return res.status(403).json({
				error: 'Compte utilisateur désactivé !',
			})
		}
		bcrypt
			.compare(req.body.password, user.password)
			.then(async (valid) => {
				if (!valid) {
					return res.status(401).json({
						error: 'Mot de passe incorrect !',
					})
				}
				const token = jwt.sign(
					{ userId: user._id },
					process.env.SECRET_TOKEN,
					{ expiresIn: '24h' }
				)
				await User.updateOne({ _id: user._id }, { token: token })
				res.status(200).json({
					userId: user._id,
					token: token,
					message: 'Utilisateur connecté !',
				})
			})
			.catch((error) =>
				res.status(500).json({
					error,
				})
			)
	} catch (error) {
		return res.status(401).json({
			error: 'Utilisateur non trouvé !',
		})
	}
}

//USER FORGOT PASSWORD
const forgotPass = async (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user.status == false) {
				return res.status(403).json({
					error: 'Compte utilisateur désactivé !',
				})
			}
			User.updateOne(
				{ _id: user.id },
				{
					token: jwt.sign(
						{ userId: user._id },
						process.env.SECRET_TOKEN,
						{ expiresIn: '5h' }
					),
				}
			)
		})
		.catch((error) =>
			res.status(500).json({
				error,
			})
		)
}

//CHECK RESEST PASSWORD TOKEN
const checkResetToken = async (req, res) => {
	const user = await User.findOne({ token: req.params.token })
	if (user) {
		res.status(200).json(user)
	} else {
		res.status(204).json({ message: 'Aucun utilisateur' })
	}
}

export {
	getOne,
	getAll,
	create,
	update,
	deleteOne,
	login,
	signup,
	forgotPass,
	checkResetToken,
}
