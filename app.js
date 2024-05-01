const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/books', (req, res, next) => {
    const books = [
        {
            userId: 'String', //identifiant MongoDB unique de l'utilisateur qui a créé le livre
            title: 'String', //titre du livre
            author: 'String', //auteur du livre
            imageUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', //illustration/couverture du livre
            year: 1992, //année de publication du livre
            genre: 'String', //genre du livre
            ratings: [
                {
                    userId: 'String', //identifiant MongoDB unique de l'utilisateur qui a noté le livre
                    grade: 5 // note donnée à un livre
                }
            ], // notes données à un livre
            averageRating: 3 //- note moyenne du livre
        }

    ];
    res.status(200).json(books);
});

module.exports = app;