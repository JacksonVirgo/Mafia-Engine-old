const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function readHTML(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
}

function getQuery(html) {
    return cheerio.load(html);
}

async function getQueryFromURL(url) {
    return getQuery(getHTML(url));
}

async function checkSiteAvailability(url) {
    const html = await readHTML(url);
    let exists = !!html;
    console.log(exists);
    return exists;
}

const getElements = async ($, elements) => {
    try {
        for (const data of elements) {
            const { selector, type, label, options } = data;
            let el = $(selector);

            if (options) {
                for (const option in options) {
                    switch (option) {
                        case 'last':
                            if (options[option] === true) el = el.last();
                            break;
                        default:
                            break;
                    }
                }
            }

            switch (type) {
                case 'full':
                    result[label] = el;
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
    } catch (err) {}
};

const getElementsFromURL = async (url, elements) => {
    try {
        const html = await readHTML(url);
        const $ = getQuery(html);
        const result = {};

        for (const data of elements) {
            const { selector, type, label, options } = data;

            let el = $(selector);

            // Add Commands which cannot be done with the pure selector.
            if (options) {
                for (const option in options) {
                    switch (option) {
                        case 'last':
                            if (options[option] === true) {
                                el = el.last();
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

            // Return the exact type of value
            switch (type) {
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
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
};

module.exports = { readHTML, checkSiteAvailability, getElementsFromURL };
