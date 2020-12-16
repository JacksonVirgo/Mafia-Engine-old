SINGULAR_ROLE = "#singular-role";
SINGULAR_RESULT = "#singular-result";
SINGULAR_RESULT_COPY = "#singular-result-copy";
SINGULAR_RESULT_SEND = "#singular-result-send";
ROLE_COLOUR = "#rcolour";

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
    return this.substring(0, index) + replacement + this.substring(index + 1);
}

var URLCleaned = {
    "!": "%21",
    "#": "%23",
    "$": "%24",
    "%": "%25",
    "&": "%26",	
    "'": "%27",
    "("	: "%28",
    ")"	: "%29",
    "*"	: "%2A",
    "+"	: "%2B",
    ","	: "%2C",
    "/"	: "%2F",
    ":"	: "%3A",
    ";"	: "%3B",
    "="	: "%3D",
    "?"	: "%3F",
    "@": "%40",
    "[": "%5B",
    "]": "%5D",
}

$(document).ready(() => {
    console.log("JQuery Initialized");

    $(SINGULAR_ROLE).on('submit', (e) => {
        e.preventDefault();
        console.log("Singular Role Submitted");

        var results = serialize(SINGULAR_ROLE); //$(SINGULAR_ROLE).serializeArray();
        var array = {};
        $.each(results, (i, field) => {
            array[field.name] = field.value;
        });

        var role = generateFormattedRole(array);
        $(SINGULAR_RESULT).text(`${role}`);
    });

    $(SINGULAR_RESULT_COPY).click(() => {
        //clipboardCopy($(SINGULAR_RESULT).text());
        clipboardCopy(generateForumPM("MafiaScum", "Role PM", $(SINGULAR_RESULT).text()));
    });    
    $(SINGULAR_RESULT_SEND).click(() => {
        var link = generateForumPM("Town of Salem", "Role PM", $(SINGULAR_RESULT).text());
        window.location.align = link;
    });

});

function clipboardCopy(text) {
    var tmp = document.createElement("textarea");
    document.body.appendChild(tmp);
    tmp.value = text;
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
}

function generateFormattedRole(roleArray) {

    var roleArrayTmp = roleArray;
    console.log("Gen Format");
    var template = $("#role_template").text();
    var namesArray = [];
    for (var property in roleArrayTmp) {
        namesArray.push(property);
    }

    for (var i = 0; i < namesArray.length; i++) {
        template = template.replaceAll(`{{${namesArray[i]}}}`, roleArray[namesArray[i]]);
    }

    //var result = `[area=${roleArray.align} ${roleArray.rname}][b][color=${roleArray.rcolour}]${roleArray.align} ${roleArray.rname}[/color][/b]\n[/area]`;
    console.log("Gen Format Finish");

    return template;
}

function generateForumPM(website, subject, message) {
    var link = "";
    var cleanedSubject = encodeURI(subject);
    var cleanedMessage = encodeURI(message);
    if (website === "Town of Salem") {
        link = `https://www.blankmediagames.com/phpbb/ucp.php?i=pm&mode=compose&username_List=JacksonVirgo&subject=${cleanedSubject}&message=${cleanedMessage}`;
    } else if (website === "MafiaScum") {
        link = `https://forum.mafiascum.net/ucp.php?i=pm&mode=compose&username_list=JacksonVirgo&subject=${cleanedSubject}&message=${cleanedMessage}`;
    }
    return link;
}

function cleanURL(text) {
    var cleanedText = text;
    var blacklist = "!*'();:@&=+$,/?#[]";
    var testArray = Array.from(cleanedText);
    for (var i = 0; i < testArray.length; i++) {
        if ((blacklist.includes(testArray[i]))) {
            cleanedText = cleanedText.replaceAt(testArray[i], `${URLCleaned[testArray[i]]}`);
        }
    }
    return cleanedText;
}



function serialize(sel) {
    var arr,
        tmp,
        i,
        $nodes = $(sel);
     $nodes = $nodes.map(function(ndx){
       var $n = $(this);
 
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