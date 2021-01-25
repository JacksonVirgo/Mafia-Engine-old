module.exports = class {
    constructor(url) {
        this.baseURL = url;
        this.ppp = 200;
        this.indent = 0;
        this.pppURL = url + "&ppp=" + this.ppp;
    }
    urlFromPost(postNum) {
        return `${this.pppURL}&start=${postNum}`;
    }
    getNextUrlAndIndent() {
        let result = `${this.pppURL}&start=${this.indent}`;
        this.applyIndent();
        return result;
    }
    pageNumberFromPost(postNum) {
        let pages = Math.floor(postNum / this.ppp) + 1;
        return pages;
    }
    applyIndent() {
        this.indent += this.ppp;
    }
}