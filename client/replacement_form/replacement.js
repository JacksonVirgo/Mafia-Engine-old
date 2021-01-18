var io = io("http://localhost:2000");//io("https://fmhelp.herokuapp.com/");
var departingPlayer;

function requestPageScrape(link) {
    io.emit('scrape-send', {type: "mafiascum", link: link});
}
io.on("connect", (data) => console.log("Connected"));
io.on('scrape-send', (data) => {
    var data = data;
    var result = "";

    // Get current date.
    let day = new Date();
    result += `${String(today.getDate()).padStart(2, '0')} ${String(today.getMonth() + 1).padStart(2, '0')} ${data.header}\n[b]Moderator:[/b] ${data.author}[tab]3[/tab][b]Replacing:[/b] ${departingPlayer}`;

    console.log(result);
    $("#result").text(result);
});    
$(document).ready(() => {
    console.log("JQuery Init");
    $("#replacement").submit((e) => {
        e.preventDefault();
        var serial = serialize($("#fieldForm"));              
        var array = serialToObject(serial);
    
        var link = array.game_thread;
        var play = array.departing_player;
    
        departingPlayer = play;
        requestPageScrape(link);
    });
});

