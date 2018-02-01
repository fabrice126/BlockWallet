import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

router.post('/signup', (req, res) => {
    //Cette API n'est pas disponible en mode production
    const { UserModel } = req.models;
    let { email, password } = req.body;
    console.log(email, password)
    if (!email || !password) return res.status(401).json("Vous devez saisir un mail et un mot de passe");
    // check('username').isEmail().withMessage('must be an email');
    var newUser = new UserModel({
        email: email.toLowerCase(),
        password: password
    });
    // Attempt to save the user
    newUser.save((err) => {
        if (err) return res.status(401).json(err);
        return res.json("Vous venez de vous inscrire");
    });
});

router.post('/', function (req, res, next) {
    const { privateConf, jwt } = req;
    const { UserModel } = req.models;
    const { email, password } = req.body
    // check('username').isEmail().withMessage('must be an email')
    UserModel.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) return res.status(401).json(err);
        if (!user) return res.status(401).json("Aucun utilisateur trouvé");
        // Check if password matches
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch || err) return res.status(401).json("Mauvais mot de passe");
            const { _id, email } = user;
            // Create token if the password matched and no error was thrown
            var token = req.jwt.sign({ _id, email }, privateConf.jwt_private_key, { expiresIn: 4 * 3600 * 24 });
            return res.json({
                success: true,
                token: 'Bearer ' + token
            });
        });
    });

});

module.exports = router;
