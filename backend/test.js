const usernameCorrection = require('./tools/formatting/usernameCorrection');
const voteCounter = require('./tools/votecount/voteCounter');
const voteFormatter = require('./tools/votecount/voteFormatter');
const settingsFormatter = require('./tools/votecount/settingsFormatter');

async function test() {
    const thread = 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85772';
    let scrapedThread = await voteCounter.getThreadDataFromURL(thread);
    let scrapedSettings = null;
    if (scrapedThread.settings) {
        scrapedSettings = settingsFormatter.parseSettings(scrapedThread.settings[0].settings);
        const formattedThread = voteFormatter.formatVoteCount(scrapedThread.scrapedPages, scrapedSettings);
        console.log(formattedThread);
    } else {
        console.log('Error');
        return { error: true, message: 'Thread does not have settings' };
    }
}

module.exports = async () => {
    console.log('Test Start');
    await test();
    console.log('Test End');
};
