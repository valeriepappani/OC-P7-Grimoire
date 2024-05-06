const express = require('express');

const router = express.Router();
const bookCtrl = require('../controllers/book');

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');

//Création d'un livre
router.post('/', auth, multer, bookCtrl.createBook);

// Récupération de tous les livres
router.get('/', bookCtrl.getAllBook);

router.get('/bestrating', bookCtrl.getBestRatedBooks);


//Récupération d'un livre spécifique
router.get('/:id', bookCtrl.getOneBook);

//MAJ un livre existant
router.put('/:id', auth, multer, bookCtrl.modifyBook);

//Suppression d'un livre
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;