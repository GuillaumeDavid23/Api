import User from '../models/User.js'

const create = (req, res) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

const update = (req, res) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

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

export  {getOne, getAll, create}