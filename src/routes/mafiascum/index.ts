import axios from 'axios';
import express from 'express'
import { load as loadHTML } from 'cheerio'
import { authMiddleware, mafiascumAuthMiddleware } from '../user';
const Router = express.Router();

interface MafiaScumQuery {
    t?: string; // Thread
    f?: string; // Forum
    p?: string; // Post
    start?: string; // First post loaded for the page.
    ppp?: string; // Posts Per Page (max 200)
}

interface MafiaScumPage {
    title?: string;
    posts?: MSPost[];
    currentPageNum?: number;
    lastPageNum?: number;
    postsPerPage?: number; // Add later
}

interface MSPost {
    author?: string;
    postId?: string;
    postNum?: number;
    cleanContent?: string;
    votes?: MSVote[];
    timestamp?: number;
}

interface MSVote {
    target: string;
    isUnvote?: boolean;
}

interface Replacement {
    before: string;
    after: string;
    post: number;
}

interface Phases {
    label?: string;
    post: number;
    count: number;
    endPost?: number;
}

export interface VoteCountSettings {
    hosts: string[];
    players: string[];
    dead?: string[];
    replacements?: Replacement[];
    dayStarts?: Phases[];
}

export const MafiaScumURI = 'https://forum.mafiascum.net/viewtopic.php';

interface MafiascumPageResponse {
    html?: string;
    hasError?: boolean;
}
const getPageHTML = async (query: MafiaScumQuery): Promise<MafiascumPageResponse> => {
    let result: MafiascumPageResponse = {}
    try {
        let parsedURI = MafiaScumURI + '?'
        if (query.t) parsedURI += `t=${query.t}&`
        if (query.f) parsedURI += `f=${query.f}&`
        if (query.start) parsedURI += `start=${query.start}&`
        if (query.ppp) parsedURI += `ppp=${query.ppp}&`
        const response = await axios.get(parsedURI);
        result.html = response.data as string;
    } catch (err: any) {
        result.hasError = true;
    }

    return result;
}

Router.get('/page', authMiddleware, mafiascumAuthMiddleware, async (req, res): Promise<any> => {
    if (!req.query) return res.status(400).json({ hasError: true, error: 'No query parameters supplied.' })

    const queryRoot = req.query as unknown as MafiaScumQuery;

    const response = await getPageHTML(queryRoot);
    if (response.hasError || !response.html) return res.status(404).json({ error: 'Page requested does not exist.' });
    const loadedData: MafiaScumPage = {};

    try {
        const $ = loadHTML(response.html);
        const pag = $('.pagination').first();
        loadedData.title = $('h2').first().text();

        const currentPageNum = parseInt(pag.find('span > strong').text());
        loadedData.currentPageNum = currentPageNum;

        const lastPageNum = parseInt(pag.find('span > a').last().text());
        loadedData.lastPageNum = Math.max(lastPageNum, currentPageNum);


        const postList = $('.post');
        loadedData.posts = [];
        postList.each((_index, el) => {
            const post: MSPost = {};


            let p = $(el);
            let userProfile = p.find('.postprofile');
            const postBody = p.find('.postbody');
            let content = postBody.find('.content')

            post.cleanContent = content.text();

            // Get Timestamp
            const dateString = postBody.find('.author');
            let scrapedDate = dateString.text().replace(/\s\s+/g, ' ').split('»')[1].trim() + ' CDT';
            const utcDate = new Date(scrapedDate)
            post.timestamp = utcDate.getTime();


            // Get User
            const username = userProfile.find('dt > a').first().text();
            post.author = username;

            // Parse Post Content
            post.votes = [];
            content.find('span').each((_i, el) => {
                let element = $(el);

                let isVote = element.hasClass('bbvote');
                if (!isVote) isVote = element.hasClass('noboldsig') && element.text().startsWith('VOTE:')
                let voteText = element.text();

                if (isVote) {
                    if (voteText.startsWith('VOTE:')) {
                        voteText = voteText.substring('VOTE:'.length, voteText.length)
                        post.votes?.push({ target: voteText.trim(), isUnvote: false });

                    } else if (voteText.startsWith('UNVOTE:')) {
                        voteText = voteText.substring('UNVOTE:'.length, voteText.length);
                        post.votes?.push({ target: voteText.trim(), isUnvote: true })
                    }
                }
            })


            // Format Request
            loadedData.posts?.push(post);
        })


        return res.status(200).json(loadedData)
    } catch (err) {
        return res.status(500).send();
    }
})

Router.get('/settings', async (req, res): Promise<any> => {
    const { t } = req.query;
    if (!t) return res.status(400).json({ error: 'Thread ID (t) not supplied. ' })

    const fakeVC: VoteCountSettings = {
        hosts: ['Nero Cain', 'Jingle'],
        players: ['StrangeMatter', 'Toogeloo', 'Enchant', 'MathBlade', 'Cat Scratch Fever', 'Greeting', 'Malakittens', 'Dwlee99', 'wavemode', 'JacksonVirgo', 'momo', 'Roden', 'MegAzuramill'],
        dead: ['momo', 'Roden'],
        dayStarts: [
            {
                post: 1,
                count: 1
            },
            {
                post: 364,
                count: 2
            }
        ]
    }

    return res.status(200).json({ settings: fakeVC })
})

export default Router;