import { body, param, check } from 'express-validator'
import User from '../../models/User.js'

const checkUserCommonBody = () => {
	return [
		body('firstname')
			.notEmpty()
			.withMessage('Vous devez indiquer votre prénom.'),
		body('firstname')
			.if(body('firstname').notEmpty())
			.isAlpha()
			.withMessage('Le prénom ne doit-être composé que de lettres.'),

		body('lastname')
			.notEmpty()
			.withMessage('Vous devez indiquer votre nom de famille.'),
		body('lastname')
			.if(body('lastname').notEmpty())
			.isAlpha()
			.withMessage(
				'Le nom de famille ne doit-être composé que de lettres.'
			),

		body('email')
			.notEmpty()
			.withMessage('Vous devez indiquer votre email.'),
		body('email')
			.if(body('email').notEmpty())
			.isEmail()
			.withMessage(
				"Le format de l'adresse email renseigné ne correspond pas à celui d'une adresse email (example@amaizon.fr)."
			),

		body('password')
			.notEmpty()
			.withMessage('Vous devez indiquer votre mot de passe.'),
		body('password')
			.if(body('password').notEmpty())
			.matches(process.env.passwordRegex)
			.withMessage(
				'Le mot de passe ne correspond pas au format requis: Au moins 8 caractères dont au moins une majuscule, une minuscule, un chiffre.'
			),

		body('phone')
			.if(body('phone').notEmpty())
			.isMobilePhone(['fr-FR', []])
			.withMessage(
				'Le format du téléphone indiqué ne correspond pas celui utilisé en France.'
			),

		body('newsletter').isBoolean(
			'La valeur "newsletter" doit-être de type booléen (0/1 ou false/true).'
		),
	]
}

const checkBuyerBody = () => {
	return [
		body('buyer')
			.notEmpty()
			.withMessage("Il faut des informations d'acheteur"),

		check('buyer.wishlist.*._id')
			.notEmpty()
			.isMongoId()
			.withMessage("La propriété n'est pas valide"),

		body('buyer.budgetMin')
			.if(body('buyer.budgetMin').notEmpty())
			.isInt({ min: 0 })
			.withMessage(
				'Le budget doit être une valeur numérique entière positive.'
			),

		body('buyer.budgetMax')
			.if(body('buyer.budgetMax').notEmpty())
			.isInt({ min: 0 })
			.withMessage(
				'Le budget doit être une valeur numérique entière positive.'
			),

		body('buyer.city')
			.if(body('buyer.city').notEmpty())
			.isString()
			.withMessage(
				'La ville désiré ne doit pas contenir de caractères spéciaux.'
			),

		body('buyer.surfaceMin')
			.if(body('buyer.surfaceMin').notEmpty())
			.isInt({ min: 1 })
			.withMessage(
				'Le nombre de pièces doit être une valeur numérique entière positive.'
			),

		body('buyer.surfaceMax')
			.if(body('buyer.surfaceMax').notEmpty())
			.isInt({ min: 1 })
			.withMessage(
				'Le nombre de pièces doit être une valeur numérique entière positive.'
			),

		body('buyer.type')
			.if(body('buyer.type').notEmpty())
			.isAlpha()
			.withMessage(
				'Le type de propriété ne doit contenir que des lettres.'
			),
	]
}

const checkSellerBody = () => {
	return [
		check('seller.propertiesList.*._id')
			.notEmpty()
			.isMongoId()
			.withMessage("La propriété n'est pas valide"),
	]
}

const checkAgentBody = () => {
	return [
		body('agent.phonePro')
			.notEmpty()
			.withMessage(
				'Vous devez indiquer le numéro de téléphone professionnel'
			),
		body('agent.phonePro')
			.if(body('agent.phonePro').notEmpty())
			.isMobilePhone(['fr-FR', []])
			.withMessage(
				'Le format du téléphone indiqué ne correspond pas celui utilisé en France.'
			),
	]
}

const checkForLogin = () => {
	return [
		body('email')
			.notEmpty()
			.withMessage('Vous devez indiquer votre email.'),
		body('email')
			.if(body('email').notEmpty())
			.isEmail()
			.withMessage(
				"Le format de l'adresse email renseigné ne correspond pas à celui d'une adresse email (example@amaizon.fr)."
			),

		body('password')
			.notEmpty()
			.withMessage('Vous devez indiquer votre mot de passe.'),
	]
}

const checkForForgotPass = () => {
	return [
		body('email')
			.notEmpty()
			.withMessage('Vous devez indiquer votre email.'),
		body('email')
			.if(body('email').notEmpty())
			.isEmail()
			.withMessage(
				'La valeur renseigné ne correspond pas à une adresse email (example@amaizon.fr).'
			),
	]
}

const checkForResetToken = () => {
	return [
		param('token')
			.notEmpty()
			.withMessage('Un token est attendu en paramètre URL.'),
		param('token')
			.if(param('token').notEmpty())
			.isJWT()
			.withMessage(
				'Le token renseigné ne correspond pas au format attendu.'
			),
	]
}

const checkUserExistence = () => {
	return [
		param('_id')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant en paramètres."),
		param('_id')
			.if(param('_id').notEmpty())
			.isMongoId()
			.withMessage("L'identifiant renseigné doit-être de type MongoId."),
		// On check l'existence de l'utilisateur:
		param('_id')
			.if(param('_id').notEmpty().isMongoId())
			.custom(async (_id) => {
				let user = await User.findOne({ _id })
				if (!user) return Promise.reject('Utilisateur inexistant !')
				return true
			}),
	]
}

export {
	checkUserCommonBody,
	checkBuyerBody,
	checkSellerBody,
	checkAgentBody,
	checkForLogin,
	checkForForgotPass,
	checkForResetToken,
	checkUserExistence,
}
