import Role from './Role.js'

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

export { getOne }
