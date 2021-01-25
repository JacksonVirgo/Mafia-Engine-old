//let departingPlayer;
let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
let replacementForm = $("#replacementForm");
let awaitHandle = $("#await");

replacementForm.on('submit', async (e) => {
    e.preventDefault();
    let data = serialToObject(replacementForm);
    let response = await fetchReplacement(data);

    console.log(response);
    $('#result').text(response.data);
});

async function fetchReplacement({ gameThread, departingPlayer }) {
    let response = { status: 'ERR', data: 'An error has occurred' };
    awaitHandle.css('display', 'inline-block');

    let proccessedURL = gameThread;
    if (gameThread.startsWith('http')) {
        proccessedURL = encodeURIComponent(proccessedURL);
    }
    const res = await fetch("http://localhost:3000/api/replacement/" + proccessedURL);
    const json = await res.json();
    const { author, currentPage, lastPage, title, url } = json;

    let today = getCurrentDate();

    let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departingPlayer}[/user]`;
    response.data = result;
    response.status = 'OK';
    awaitHandle.css('display', 'none');
    return response;
}

async function fetchReplacementRaw({ gameThread, departingPlayer }) {
    let response = { status: 'ERR', data: 'An error has occurred' };
    awaitHandle.css('display', 'inline-block');

    let processedURL = encodeURIComponent(gameThread);
    const res = await fetch("http://localhost:3000/api/replacement/" + processedURL);
    const json = await res.json();
    const { author, currentPage, lastPage, title, url } = json;

    let today = getCurrentDate();

    let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departingPlayer}[/user]`;
    response.data = result;
    response.status = 'OK';
    awaitHandle.css('display', 'none');
    return response;
}

function getCurrentDate() {
    let date = new Date();
    let currentDay = date.getDate();
    currentDay = attachSuffixOf((currentDay < 10) ? `0${currentDay}` : currentDay);
    let currentMonth = date.getMonth() + 1;
    currentMonth = (currentMonth < 10) ? `0${currentMonth}` : currentMonth;
    return `${currentDay} ${months[currentMonth - 1]}`;
}

/**
 * Sends the link to be scraped by the server.
 * @param {*} url URL to be processed.
 */
function requestPageScrape(url) {
    io.emit('scrapeReplacement', { url: url });
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
    $nodes = $nodes.map(function(ndx){
        let $n = $(this);
        if($n.is('form'))
            return $n.find('input, select, textarea').get(); 
        return this;
    });
    $nodes.each(function(ndx, el){
        if ((el.nodeName.toUpperCase() == 'INPUT') && ((el.type.toUpperCase() == 'CHECKBOX') || (el.type.toUpperCase() == 'RADIO'))){
            if((el.value === undefined) || (el.value == ''))
            el.value = 1;
        }
    });
    arr = $nodes.serializeArray();
    tmp = [];
    for(i = 0; i < arr.length; i++)
        tmp.push(arr[i].name);
        $nodes.filter('input[type="checkbox"]:not(:checked)').each(function(){
        if(tmp.indexOf(this.name) < 0){
            arr.push({name: this.name, value: ''});
        }
    }); 
    return arr;
}