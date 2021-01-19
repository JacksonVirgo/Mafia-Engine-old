var io = io("http://localhost:2000");//io("https://fmhelp.herokuapp.com/");
var departingPlayer;

let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

$("#replacementForm").on("submit", (e) => {
    e.preventDefault();
    console.log("F");
    let array = serialToObject("#replacementForm");
    departingPlayer = array.departingPlayer;
    requestPageScrape(array.gameThread);
});
io.on("connect", (data) => console.log("Connected"));
io.on('scrapeReplacement', ({ title, author, currentPage, lastPage, url })  => {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    dd = attachSuffixOf((dd < 10) ? "0"+dd : dd);
    mm = (mm < 10) ? "0"+mm : mm;
    let today = `${dd} ${months[mm - 1]}`;
    let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departingPlayer}[/user]`;
    $("#result").text(result);
});

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