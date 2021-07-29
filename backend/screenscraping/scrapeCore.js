const fetch = require('node-fetch');

async function getHTML(url) {
    let result = null;
    try {
        const response = await fetch(url);
        result = await response.text();
    } catch (err) {
        console.log(err);
    }
    return result;
}

module.exports = {
    getHTML,
};
