import { param, validationResult } from 'express-validator'
import fs from 'fs'

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

	// CAS PARTICULIER: On supprime les photos enregistrées en base dans le cas des propriétés:
	if (req.filesName !== undefined) {
		console.log(req.filesName)
		Object.keys(req.filesName).forEach((imgKey) => {
			fs.unlink('public/uploads/' + req.filesName[imgKey], (err) => {
				if (err) console.log(err)
				else console.log(`${req.filesName[imgKey]} deleted`)
			})
		})
	}

	return res.status(422).json({
		status_code: 422,
		message: 'La validation à échouée.',
		errors: extractedErrors,
	})
}

export { validateParamId, validation }
