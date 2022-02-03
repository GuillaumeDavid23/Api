import Role from './Role.js'

/**
 * @api {get} /api/role/ Récupérer tous les roles
 * @apiName getAll
 * @apiGroup Rôle
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Role} role Objet Role.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Roles récupérés !',
		"data": role,
 *     }
 *
 * @apiError RoleNotFound Aucun Role.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Aucun Role trouvé !"
 *     }
 */
const getAll = async (req, res) => {
	try {
		const role = await Role.find()
		if (role) {
			res.status(200).json(role)
		} else {
			res.status(204).json({ message: 'Aucun rôle' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

/**
 * @api {get} /api/role/:_id Récupérer un role
 * @apiName getOne
 * @apiGroup Rôle
 * 
 * @apiHeader {String} Authorization Token d'authentification
 *
 * @apiSuccess {Role} role Objet Role.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": 'Role récupéré !',
		"data": role,
 *     }
 *
 * @apiError RoleNotFound Aucun Role.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Aucun Role trouvé !"
 *     }
 */
const getOne = async (req, res) => {
	try {
		const role = await Role.findById(req.params._id)
		if (role) {
			res.status(200).json(role)
		} else {
			res.status(204).json({ message: 'Aucun rôle' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json(error)
	}
}

export { getOne, getAll }
