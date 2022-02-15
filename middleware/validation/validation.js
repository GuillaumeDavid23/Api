import { param, validationResult } from 'express-validator'

const validateParamId = (req, res, next) => {
	return [
		param('_id')
			.notEmpty()
			.withMessage("Vous devez indiquer l'identifiant en paramètres."),
		param('_id')
			.if(param('_id').notEmpty())
			.isMongoId()
			.withMessage("L'identifiant renseigné doit-être de type MongoId."),
	]
}

const validation = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next()
	}
	const extractedErrors = []
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({
		errors: extractedErrors,
	})
}

export { validateParamId, validation }
