var io = io("http://localhost:2000");//io("https://fmhelp.herokuapp.com/");
var departingPlayer;

function requestPageScrape(link) {
    io.emit('scrape-send', {type: "mafiascum", link: link});
}
io.on('scrape-send', (data) => {
    var data = data;
    $("#result").text(`Thread Title: ${data.header}\nGame Moderator: ${data.author}\nPage Length: ${data.pageCount}`);
});    
$(document).ready(() => {
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