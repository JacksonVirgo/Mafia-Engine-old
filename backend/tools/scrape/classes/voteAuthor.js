const authorList = [];
class Author {
    constructor() {
        this.author = null;
        this.pronoun = null;
        this.votes = [];
        this.urls = [];
    }
}

module.exports = {
    Author,
    authorList
}