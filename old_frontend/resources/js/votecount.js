//var io = io("http://localhost:2000");//io("https://fmhelp.herokuapp.com/");
const config = {};

$('#voteForm').on('submit', async (e) => {
    e.preventDefault();
    let serial = serialToObject('#voteForm');
    $('#await').css('display', 'inline-block');
    let data = await requestVoteCount(serial.gameThread);
    $('#await').css('display', 'none');
    $('#result').text(data.data);
    console.log(data);
});

async function requestVoteCount(gameThread) {
    let api = config.serverLink;
    if (!api) { api = "http://localhost:3000" }
    const response = await fetch(api + '/api/votecount/format/' + encodeURIComponent(gameThread));
    const json = await response.json();
    console.log(json);
    return json;
    //return generateVoteCount(json);
}

function generateVoteCount(votes) {
    let voteList = votes.voteCount;
    let unknownVotes = votes.unknownVotes;

    let voteCount = {};

    for (const author in voteList) {
        console.log(author);
    }
    return voteCount;
}

$("#replacementForm").on("submit", (e) => {
    e.preventDefault();
    let array = serialToObject("#replacementForm");
    $("#await").css("display", "inline-block");
    departingPlayer = array.departingPlayer;
    requestPageScrape(array.gameThread);
});
// io.on("connect", (data) => console.log("Connected"));
// io.on('scrapeVotecount', ({ voteCount })  => {
//     $("#await").css("display", "none");

//     let result = "";
//     for (const property in voteCount) {
//         result += `${property} - ${voteCount[property]}\n`;
//     }

//     $("#result").text(result);
// });

/**
 * Sends the link to be scraped by the server.
 * @param {*} url URL to be processed.
 */
function requestPageScrape(url) {
    //io.emit('scrapeVotecount', { url: url });
}


/**
 * Attaches a suffix to an integer.
 * @param {number} i 
 */
function attachSuffixOf(i) {
    let j = i % 10, k = i % 100;
    if (j == 1 && j != 11) return i + "st";
    else if (j == 2 && k != 12) return i + "nd";
    else if (j == 3 && k != 13) return i + "rd";
    else return i + "th";
}

/**
 * Serializes a form and returns output as an Object.
 * @param {*} sel JQuery ID for an HTML Form to convert.
 */
function serialToObject(sel) {
    let result = serialize(sel);
    let array = {};
    $.each(result, (i, field) => {
        array[field.name] = field.value;
    });
    return array;
}

/* Serialize a HTML Form Completely */
function serialize(sel) {
    let arr, tmp, i, $nodes = $(sel);
    $nodes = $nodes.map(function (ndx) {
        let $n = $(this);
        if ($n.is('form'))
            return $n.find('input, select, textarea').get();
        return this;
    });
    $nodes.each(function (ndx, el) {
        if ((el.nodeName.toUpperCase() == 'INPUT') && ((el.type.toUpperCase() == 'CHECKBOX') || (el.type.toUpperCase() == 'RADIO'))) {
            if ((el.value === undefined) || (el.value == ''))
                el.value = 1;
        }
    });
    arr = $nodes.serializeArray();
    tmp = [];
    for (i = 0; i < arr.length; i++)
        tmp.push(arr[i].name);
    $nodes.filter('input[type="checkbox"]:not(:checked)').each(function () {
        if (tmp.indexOf(this.name) < 0) {
            arr.push({ name: this.name, value: '' });
        }
    });
    return arr;
}