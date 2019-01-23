const express = require('express');
const router = express.Router();
const service = require('./service.js');

router.get('/', function(req, res, next) {
    service.getAllArticles()
        .then(articles => res.json(articles))
        .catch(err => handleError(err, next));
});
router.get('/:id', function(req, res, next) {
    service.getArticle(req.params.id)
        .then(article => res.json(article))
        .catch(err => handleError(err, next));
});
router.post('/', function(req, res, next) {
    service.saveArticle(req.body)
        .then(() => res.sendStatus(201))
        .catch(err => handleError(err, next));
});
router.put('/:id', function(req, res, next) {
    var article = req.body;
    article._id = req.params.id;
    service.updateArticle(article)
        .then(() => res.sendStatus(200))
        .catch(err => handleError(err, next));
});
router.delete('/:id', function(req, res, next) {
    service.deleteArticle(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(err => handleError(err, next));
});

function handleError(err, next) {
    next(err);
}

module.exports = router;
