module.exports = class {
    constructor(url) {
        this.baseURL = url;
        this.ppp = 200;
        this.pppURL = url + "&ppp=" + this.ppp;
    }
    urlFromPost(postNum) {
        return `${this.pppURL}&start=${postNum}`;
    }
    pageNumberFromPost(postNum) {
        let pages = Math.floor(postNum / this.ppp) + 1;
        return pages;
    }
}