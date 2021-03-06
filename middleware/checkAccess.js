const checkAccess = (roles) => {
	return (req, res, next) => {
		let user = req.auth.user
		if (user) {
			let isAllowed = 0

			roles.forEach((role) => {
				switch (role) {
					case 'buyer':
						if (user.buyer) {
							isAllowed = 1
						}
						break
					case 'seller':
						if (user.seller) {
							isAllowed = 1
						}
						break
					case 'agent':
						if (user.agent) {
							isAllowed = 1
						}
						break
					default:
						isAllowed = 0
						break
				}
			})
			if (isAllowed === 1) {
				next()
			} else {
				res.status(401).json({
					error: "Vous n'êtes pas autorisé içi !",
				})
			}
		} else {
			res.status(400).json({ message: "Vous n'êtes pas connecté" })
		}
	}
}

export default checkAccess
