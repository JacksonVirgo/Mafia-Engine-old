const fetch = require('node-fetch');
const cheerio = require('cheerio');

const readHTML = async (uri) => {
    const res = await fetch(uri);
    const content = await res.text();
    return content;
};

const getStaticQuery = async (html) => {
    return cheerio.load(html);
};

const getQueryFromUri = async (uri) => {
    const html = await readHTML(uri);
    const query = await getStaticQuery(html);
    return query;
};

const getElementsFromUri = async (uri, elements) => {
    const $ = await getQueryFromUri(uri);
    if (!$) return null;

    const el = await getElements($, elements);
    return el;
};

const getElements = async ($, elements) => {
    if (!$ || !elements) return null;

    const result = {};

    console.log($);
    try {
        for (const data of elements) {
            const { selector, type, label, options } = data;

            let el = null;
            if (typeof $ === 'function') el = $(selector);
            else el = $.find(selector);

            if (options) {
                for (const option in options) {
                    switch (option) {
                        case 'last':
                            if (options[option] === true) el = el.last();
                            break;
                        case 'first':
                            if (options[option] === true) el = el.first();
                        default:
                            break;
                    }
                }
            }

            switch (type) {
                case 'full':
                    result[label] = $(el);
                    break;
                case 'text':
                    result[label] = el.text();
                    break;
                case 'value':
                    result[label] = el.val();
                    break;
                default:
                    break;
            }
        }
    } catch (err) {
        console.log(err);
    }
    return result;
};

module.exports = {
    readHTML,
    getStaticQuery,
    getQueryFromUri,
    getElements,
    getElementsFromUri,
};
