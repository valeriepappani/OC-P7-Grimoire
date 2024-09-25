const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PasswordValidator = require('password-validator');
const emailValidator = require('email-validator'); // Importation de email-validator

const User = require('../models/user');

require('dotenv').config();

exports.signup = (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;
    const schema = new PasswordValidator();

    // Définition des règles du schéma
    schema
        .is().min(8)                                    // Minimum 8 caractères
        .is().max(20)                                   // Maximum 20 caractères
        .has().uppercase()                              // Doit contenir au moins une majuscule
        .has().lowercase()                              // Doit contenir au moins une minuscule
        .has().digits()                                 // Doit contenir au moins un chiffre
        .has().not().spaces();                          // Ne doit pas contenir d'espaces

    // Validation de l'adresse email
    if (!emailValidator.validate(email)) {
        return res.status(400).json({ message: 'Adresse email invalide' });
    }

    // Validation du mot de passe
    const validationErrors = schema.validate(password);

    if (validationErrors === false) {
        return res.status(400).json({ message: 'Mot de passe invalide', errors: validationErrors });
    } else {
        bcrypt.hash(password, 10)
            .then(hash => {
                const user = new User({
                    email: email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => {
                res.status(500).json({ error });
            });
    }
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // Validation de l'adresse email
    if (!emailValidator.validate(email)) {
        return res.status(400).json({ error: 'Adresse email invalide' });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }

                    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log de la clé secrète

                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
