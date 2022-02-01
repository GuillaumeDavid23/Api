import { body, validationResult } from 'express-validator'

export default (req, res, next) => {
	body('id_agent').isMongoId()
	body('inOut').isBoolean()
	body('userReference').isAlphanumeric()
	body('date').isDate()
	body('previousBuyerRef').isAlphanumeric()
	// body('lst_statsMeters').is
	// body('lst_roomDetails').is

	if (!validationResult(req).isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	} else {
		next()
	}
}
