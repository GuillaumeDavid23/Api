import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const create = (req, res) => {
    const saltRounds = 10;
    delete req.body._id;
    const user = new User({
        ...req.body,
    });
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        user.password = hash
        user.save()
            .then(() => res.status(201).json({
                message: 'Utilisateur créé !'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    });
};

const update = (req, res) => {
	User.updateOne(
		{
			_id: req.params._id,
		},
		{
			...req.body,
		}
	)
		.then((response) =>{
			res.status(201).json({
				message: 'Utilisateur modifié !',
			})
        }
            
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
    
}

const getOne = async (req, res) => {        
    try {
        const user = await User.findById(req.params._id)
        if (user){
            res.status(200).json(user)
        }else{
            res.status(204).json({message: 'Aucun utilisateur'})
        } 
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

const getAll = async (req, res) => {        
    try {
        const user = await User.find()
        if (user){
            res.status(200).json(user)
        }else{
            res.status(204).json({message: 'Aucun utilisateur'})
        } 
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

const deleteOne = async (req, res) => {
    User.updateOne(
		{
			_id: req.params._id,
		},
		{
			status: 0,
		}
	)
		.then((response) =>{
			res.status(201).json({
				message: 'Utilisateur désactivé !',
			})
        }
            
		)
		.catch((error) =>
			res.status(400).json({
				error,
			})
		)
}

const signup = async (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                ...req.body,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }))
};

const login = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        ),
                        message: 'Utilisateur connecté !'

                    });
                })
                .catch(error => res.status(500).json({
                    error
                }))
        })
        .catch(error => res.status(500).json({
            error
        }));
};
export  {getOne, getAll, create, update, deleteOne, login, signup}