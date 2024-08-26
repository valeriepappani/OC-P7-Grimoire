const multer = require('multer');
const sharp = require('sharp');
const path = require('path'); // Importez le module path
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const isWebp = file.mimetype === 'image/webp'; // Vérifie si c'est déjà un WebP
    const fileExtension = isWebp ? 'webp' : extension; // Utilise le bon extension
    callback(null, name + Date.now() + '.' + fileExtension);
  }
});

const upload = multer({ storage: storage }).single('image');

// Middleware de gestion des fichiers avec compression d'image au format WebP
const uploadWithCompressionWebP = (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Compression de l'image avec sharp et enregistrement au format WebP
    if (req.file) {
      const webpFilename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const webpImagePath = path.join("images", webpFilename);

      sharp(req.file.path)
        .resize({ width: 800 }) // Redimensionner l'image
        .toFormat('webp', { quality: 80 }) // Convertir l'image au format WebP
        .toFile(webpImagePath, (err, info) => {
          if (err) {
            console.error("Erreur lors du traitement de l'image");
            return res.status(500).json({
              error: "Erreur lors du traitement de l'image",
            });
          }

          // Suppression de l'ancienne image
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error("Erreur lors de la suppression de l'image");
            } else {
              console.log("Ancienne image supprimée avec succès !");
            }
          });

          req.file.filename = webpFilename;
          next();
        });
    } else {
      next();
    }
  });
};

module.exports = uploadWithCompressionWebP;