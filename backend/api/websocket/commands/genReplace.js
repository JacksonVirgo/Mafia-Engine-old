const Command = require('../Command');
const urlUtil = require('../../../util/url');
const Time = require('../../../util/Time');
const scrapeCore = require('../../../tools/scrape/scrapeCore');

const RES = {
    INVALID_URL: { error: true, message: 'Invalid URL' },
    INVALID_SEL: { error: true, message: 'Could not find required elements' },
};

const formatReplace = (fetchedData, url, user, today) => {
    const { title, moderator, lastPage } = fetchedData;
    let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${moderator}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${user}[/user]`;
    return result;
};

module.exports = Command('genReplace', async (socket, data, tag) => {
    const response = {};
    const { url, user, raw } = data;

    // Validate URL
    const urlValid = urlUtil.validate(url);
    if (!urlValid) return socket.emit(tag, RES.INVALID_URL);

    // Scrape Page
    const fetchData = [
        { label: 'title', selector: 'h2 > a', type: 'text' },
        { label: 'moderator', selector: '.postprofilecontainer > dl > dt > a:first', type: 'text' },
        { label: 'currentPage', selector: '.pagination > input:first', type: 'value' },
        { label: 'lastPage', selector: 'div.pagination > span > a', options: { last: true }, type: 'text' },
    ];

    const fetchedElements = await scrapeCore.getElementsFromURL(url, fetchData);
    if (!fetchedElements) return socket.emit(tag, RES.INVALID_SEL);

    // Generate Form
    if (raw) return socket.emit(tag, { raw: true, data: fetchedElements });
    const today = Time.getCalendarDate();
    const formattedForm = formatReplace(fetchedElements, url, user, today);
    response.form = formattedForm;
    socket.emit(tag, response);
});
