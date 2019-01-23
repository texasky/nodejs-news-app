let mongoose = require('mongoose');
let newsArticle = require('./newsArticle');

function service() {
    return {
        getArticle: getArticle,
        getAllArticles: getAllArticles,
        saveArticle: saveArticle,
        updateArticle: updateArticle,
        deleteArticle: deleteArticle
    };
    function getArticle(id) {
        return newsArticle.findOne({ _id: id }, {'__v': 0});
    }
    function getAllArticles() {
        return newsArticle.find({}, { '__v': 0 });
    }
    function saveArticle(article) {
        return newsArticle.create(article);
    }
    function updateArticle(article) {
        return newsArticle.update({ _id: article._id }, article);
    }
    function deleteArticle(id) {
        return newsArticle.remove({ _id: id });
    }
}

module.exports = service();
