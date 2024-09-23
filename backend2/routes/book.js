const express = require('express');

const router = express.Router();
const bookCtrl = require('../controllers/book');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBook); // Récupération de tous les livres
router.get('/bestrating', bookCtrl.getBestRatedBooks); // Récupère les 3 livres les mieux notés
router.get('/:id', bookCtrl.getOneBook); //Récupération d'un livre spécifique
router.post('/', auth, multer, bookCtrl.createBook); //Création d'un livre
router.post('/:id/rating', auth, bookCtrl.addRating);
router.put('/:id', auth, multer, bookCtrl.modifyBook); //MAJ un livre existant
router.delete('/:id', auth, bookCtrl.deleteBook); //Suppression d'un livre


module.exports = router;