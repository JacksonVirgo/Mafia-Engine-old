SINGULAR_ROLE = "#singular-role";
SINGULAR_RESULT = "#singular-result";
SINGULAR_RESULT_COPY = "#singular-result-copy";
ROLE_COLOUR = "#rcolour";
ADD_FIELD = "#add-field";
GENERATE_BTN = "#generate-btn";

// Send as PM Form
SEND_AS_PM = "#send-as-pm";

$(document).ready(() => {
    console.log("JQuery Initialized");

    var currentCustoms = 0;
    $(SINGULAR_ROLE).on('submit', (e) => {
        e.preventDefault();
        console.log("Singular Role Submitted");

        var results = serialize(SINGULAR_ROLE); //$(SINGULAR_ROLE).serializeArray();
        var array = {};
        $.each(results, (i, field) => {
            array[field.name] = field.value;
        });

        console.log(array);

        var role = generateFormattedRole(array);
        $(SINGULAR_RESULT).text(`${role}`);
    });
    $(ADD_FIELD).click(() => {
        var label = $("<label/>")
        var component = $("<input/>");

        var id = `custom${currentCustoms}`;
        component.attr("id", id);
        component.attr("name", id);
        label.attr("for", id);
        label.text(id);

        currentCustoms += 1;

        // Move the role template down
        $(SINGULAR_ROLE).append(label).append(component).append($("#template-lbl")).append($("#role_template")).append($(GENERATE_BTN));
    });

    $(SINGULAR_RESULT_COPY).click(() => {
        clipboardCopy($(SINGULAR_RESULT).text());
    });
    // $(SINGULAR_RESULT_SEND).click(() => {
    //     var link = generateForumPM("Town of Salem", "Role PM", $(SINGULAR_RESULT).text());
    //     window.location.align = link;
    // });

    $(SEND_AS_PM).on('submit', (e) => {
        e.preventDefault();
        var results = serialize(SEND_AS_PM);
        var array = {};
        $.each(results, (i, field) => {
            array[field.name] = field.value;
        });

        var link = generateForumPM(array.forum, "Role PM", $(SINGULAR_RESULT).val());
        console.log(link);
        openInNewTab(link);
    });
});

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

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
    var template = $("#role_template").val();
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
    var cleanedRecipient = encodeURIComponent("JacksonVirgo");
    var cleanedSubject = encodeURIComponent(subject);
    var cleanedMessage = encodeURIComponent(message);
    if (website === "tos") {
        link = `https://www.blankmediagames.com/phpbb/ucp.php?i=pm&mode=compose&username_list=${cleanedRecipient}&subject=${cleanedSubject}&message=${cleanedMessage}`;
    } else if (website === "ms") {
        link = `https://forum.mafiascum.net/ucp.php?i=pm&mode=compose&username_list=${cleanedRecipient}&subject=${cleanedSubject}&message=${cleanedMessage}`;
    }
    return link;
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