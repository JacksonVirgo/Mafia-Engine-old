
var io = io("http://localhost:2000");//io("https://fmhelp.herokuapp.com/");

// JQuery Handles
const JQUERY_FIELDS = {
    FORM: {
        SINGULAR: "#singular-role",
        CSV: "#csv-role",
        RAND: "#randingForm",
        SAVE: "#saveForm",
        LOAD: "#loadForm"
    },
    SUBMIT: {
        SINGULAR: "#generate-btn-singular",
        SEND_PM: "#send-as-pm",
        ADD_FIELD: "#add-field"
    },
    MISC: {
        GLOBALS: "#default-table"
    },  
    TEMPLATE: "#role_template"
}

// Singleton item for when Fields are being editied.
const FIELD_SINGLETON = { focus: undefined, list: [], modal: $("#fieldModal") };
const FIELD_TEMPLATES = { list: [] };
const DEFAULTS = { template: "" };
var ROLE_LIST = null;

// #region JQuery Initialization
$(document).ready(() => {
    let { FORM, SUBMIT, TEMPLATE } = JQUERY_FIELDS;
    initFieldModal();
    $(FORM.CSV).on('submit', (e) => onSubmit_CSVRoles(e));
    $(FORM.SINGULAR).on('submit', (e) => onSubmit_SingularRole(e));
    $(FORM.RAND).on('submit', (e) => onSubmit_Rand(e));
    $(SUBMIT.ADD_FIELD).click((e) => onSubmit_AddField(e));
    $(SUBMIT.SEND_PM).on('submit', (e) => onSubmit_SendPM(e));
    $(FORM.SAVE).on('submit', (e) => onSubmit_Save(e));
    $(FORM.LOAD).on('submit', (e) => onSubmit_Load(e));
    
    $.getJSON("./role_card_generator/defaults.json", (json) => {
        var fields = json.fields;
        var global = json.global;
        for (var i = 0; i < fields.length; i++) {
            $(FORM.SINGULAR).append(createSingularField(fields[i].name, fields[i].handle)).append($(SUBMIT.SINGULAR));
        }
        DEFAULTS.template = json.template;
        $(JQUERY_FIELDS.TEMPLATE).text(DEFAULTS.template);

        for (const property in global) {
            newDefaultRow(property, global[property]);
        }
    });
});

// #endregion

/**
 * Initialises the popup Modal for editing Custom Fields 
 * within the Singular Role formatter.
 */
function initFieldModal() {
    let { modal, focus } = FIELD_SINGLETON;
    FIELD_TEMPLATES.textarea = $("#template_field_textarea");

    var close = $(".modal-close");
    close.on("click", (e) => {
        modal.css("display", "none");
    });
    $("#fieldForm").submit((e) => {
        e.preventDefault();
        var serial = serialize($("#fieldForm"));              
        var array = serialToObject(serial);
        var input = focus.children(".field-input");

        focus.children("label").text(array.field_name);
        focus.children("label").attr("for", array.field_handle);

        focus.children(".field-input").attr("id", array.field_handle);
        focus.children(".field-input").attr("name", array.field_handle);

        // Check type has changed and if so, change it.
        var nodeName = focus.children(".field-input").prop('nodeName');
        var nodeType = focus.children(".field-input").attr("type");

        console.log(nodeType);
        if (array.field_type === "txtfield") {
            switch (nodeName) {
                case "INPUT":
                    input.attr("type", "text");
                    break;
                case "TEXTAREA":
                    input.changeElementType("input");
                    input.attr("type", "text");
                    break;
            }
        } else if (array.field_type === "txtarea") {
            switch (nodeName) {
                case "INPUT":
                    input.changeElementType("textarea");
                    break;            
                }
        }
        console.log(nodeName);

        $("#fieldForm").trigger("reset");
        modal.css("display", "none");
    });

    $("#singular-create-field").click(() =>{
        var field = createSingularField_Empty();
        $(JQUERY_FIELDS.FORM.SINGULAR).append(field).append($(JQUERY_FIELDS.SUBMIT.SINGULAR));
    });
}
function editSingularField(newFocus) {
    var { focus, list, modal } = FIELD_SINGLETON;
    focus = list[newFocus];

    var label = focus.children("label");
    var input = focus.children(".field-input");

    var nodeName = input.prop("nodeName");
    var nodeType = input.attr("type");

    var type = "";
    switch (nodeName) {
        case "INPUT":
            if (nodeType === "text") type="txtfield";
            if (nodeType === "colour") type="colour";
            break;
        case "textarea":
            text="txtarea";
            break;
    }

    var handle = label.attr("for");
    var name = label.text();
    $("#field_name").attr("value", name);
    $("#field_handle").attr("value", handle);
    $("#field_type").val(type).attr("selected", "selected");

    $("#field_type").change(() => {
        console.log($(this).val());
    })

    modal.css("display", "block");
}

//#region Singular Role
function createSingularField_Empty() {
    const DEFAULT_NAME = "New Field";
    const DEFAULT_ID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    return createSingularField(DEFAULT_NAME, DEFAULT_ID);
}
function createSingularField(name, id) {
    var field = $("<div />");
    field.addClass("form-component");
    var label = $("<label />");
    label.addClass("field-label");
    label.attr("for", id);
    label.text(name);

    var input = $("<input />");
    input.addClass("field-input");
    input.attr("type", "text");
    input.attr("id", id);
    input.attr("name", id);

    var button = $("<input />");
    button.addClass("field-button");
    button.attr("type", "button");
    button.attr("value", "Edit");

    FIELD_SINGLETON.list[id] = field;
    
    button.click((e) => {
        editSingularField(id);
    });

    field.append(label).append(button).append(input);   
    return field;
}

//#endregion

//#region Export Functions

/* Export Section Functions*/
function createExportSection(title, id, content) {
    var result = $("<div />");
    var header = $("<span />");
    var textarea = $("<textarea />");
    var revealBtn = $("<button />");
    var sendBtn = $("<button />");
    var copyBtn = $("<button />");

    function getResult(target) {
        return $(`#${target.target.id}`).parent().parent().children(".resultArea");
    }

    header.text(`${title}`);
    result.addClass("exportSectionDiv");
    revealBtn.attr("id", `btnReveal_${id}`);
    revealBtn.text("Reveal/Hide");
    revealBtn.bind("click", (e) => {
        var ltextarea = getResult(e);
        ltextarea.css("display", ((ltextarea.css("display") === "block") ? "none" : "block"));
    });
    
    sendBtn.text("Send as PM");
    sendBtn.attr("id", `btnSend_${id}`);
    sendBtn.bind("click", (e) => {
        var ltextarea = getResult(e);

        var subj = $("#subj").val();
        var play = $("#username").text();

        $("#send-as-pm").trigger("reset");
        $("#subj").val(subj);
        $("#username").text(play);
        $("#content").text(ltextarea.text());
        openTab(e, "forum");
    });

    copyBtn.text("Copy");
    copyBtn.attr("id", `btnCopy_${id}`);
    copyBtn.bind("click", (e) => {
        var ltextarea = getResult(e);
        clipboardCopy(ltextarea.text());
    });
    textarea.text(content);
    textarea.addClass("resultArea");

    result.append(header);
    header.append(revealBtn);
    header.append(sendBtn);
    header.append(copyBtn);
    result.append(textarea);
    return result;
}

function createRandExport(title, id, content) {
    var result = $("<div />"); 
    var header = $("<span />");
    var textarea = $("<textarea />");
    var revealBtn = $("<button />");
    var sendBtn = $("<button />");
    var copyBtn = $("<button />");

    function getResult(target) {
        return $(`#${target.target.id}`).parent().parent().children(".resultArea");
    }

    header.text(`${title}`);
    result.addClass("exportSectionDiv");
    revealBtn.attr("id", `btnReveal_${id}`);
    revealBtn.text("Reveal/Hide");
    revealBtn.bind("click", (e) => {
        var ltextarea = getResult(e);
        ltextarea.css("display", ((ltextarea.css("display") === "block") ? "none" : "block"));
    });
    
    sendBtn.text("Send as PM");
    sendBtn.attr("id", `btnSend_${id}`);
    sendBtn.bind("click", (e) => {
        var ltextarea = getResult(e);

        var subj = $("#subj").val();
        var play = $("#username").text();

        $("#send-as-pm").trigger("reset");
        $("#subj").val(subj);
        $("#username").text(title);
        $("#content").text(ltextarea.text());
        openTab(e, "forum");
    });

    copyBtn.text("Copy");
    copyBtn.attr("id", `btnCopy_${id}`);
    copyBtn.bind("click", (e) => {
        var ltextarea = getResult(e);
        clipboardCopy(ltextarea.text());
    });
    textarea.text(content);
    textarea.addClass("resultArea");

    result.append(header);
    header.append(revealBtn);
    header.append(sendBtn);
    header.append(copyBtn);
    result.append(textarea);
    return result;
}

//#endregion

//#region Defaults Functions
function newDefaultRow(handle, content) {
    let row = $("<tr />");
    let handCell = $("<td />");
    let contCell = $("<td />");
    // let delCell = $("<td />");

    handCell.attr("contentEditable","true");
    contCell.attr("contentEditable","true");
    handCell.text(handle);
    contCell.text(content);
    // delCell.text("X");
    // delCell.addClass("deleteTD");
    // delCell.click(() => {
    //     row.empty();
    //     row.remove();
    // })
    row.append(handCell).append(contCell);//.append(delCell);
    $("#default-table > tbody").append(row);
}
function newDefaultRowBlank() {
    newDefaultRow("handle", "New Content");
}
//#endregion

//#region Submission Functions
/* Submission Functions */
function onSubmit_SingularRole(e) {
    e.preventDefault();
    var array = {};
    $.each(serialize($(JQUERY_FIELDS.FORM.SINGULAR)), (i, field) => {
        array[field.name] = field.value;
    });
    parseRoles([array]);
}

/**
 * 
 * @param {*} e Event Value
 */
function onSubmit_CSVRoles(e) {
    e.preventDefault();
    var fileList = document.getElementById('csv-file').files[0];
    Papa.parse(fileList, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(res) {
            var roles = [];
            for (const data of res.data) {
                roles.push(data);
            }
            parseRoles(roles);
        }
    });
}

function onSubmit_Rand(e) {
    e.preventDefault();
    let array = serialToObject(JQUERY_FIELDS.FORM.RAND);
    io.emit("rand", {
        players: array["playerList"],
        list: ROLE_LIST
    });
}


/**
 * Request the server to format roles, sanitises information to be sent
 * efficiently in one package.
 * @param {*} roles Object of values for the roles.
 */
function parseRoles(roleList) {
    io.emit("parse-card", {chunk: $("#role_template").val(), globals: getObjectFromGlobals(), list: roleList});
}

function getObjectFromGlobals() {
    let table = $("#default-table > tbody tr:has(td)").map(function(i, v) {
        var $td = $('td', this);
        return {
            id: ++i,
            handle: $td.eq(0).text(),
            content: $td.eq(1).text()
        }
    }).get();
    return table;
}

function onSubmit_AddField(e) {
    var currentCustoms = 0;
    var label = $("<label/>")
    var component = $("<input/>");
    var id = `custom${currentCustoms}`;
    component.attr("id", id);
    component.attr("name", id);
    label.attr("for", id);
    label.text(id);

    currentCustoms += 1;
    // Move the role template down
    $(JQUERY_FIELDS.FORM.SINGULAR).append(label).append(component).append($("#template-lbl")).append($("#role_template")).append($(JQUERY_FIELDS.FORM.SINGULAR));
}
function onSubmit_SendPM(e) {
    e.preventDefault();
    var results = serialize($(JQUERY_FIELDS.SUBMIT.SEND_PM));
    var array = {};
    $.each(results, (i, field) => {
        array[field.name] = field.value;
    });

    var usernames = array["username"];
    var users = usernames.split("\n");

    var link = generateForumPM(array.forum, users, array.subj, array.content);
    openInNewTab(link);
}
function onSubmit_Save(e) {
    e.preventDefault();
    let template = $(JQUERY_FIELDS.TEMPLATE).val();
    let globals = getObjectFromGlobals();

    download({template: template, globals: globals}, "save.json", "text/plain");
}
function onSubmit_Load(e) {
    e.preventDefault();
    let result = null;
    let file = document.getElementById('loadFile').files[0];
    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (evt) => {
        result = JSON.parse(evt.target.result);
        $(JQUERY_FIELDS.TEMPLATE).val(result.template);

        let tbody = $(`${JQUERY_FIELDS.MISC.GLOBALS} > tbody`);
        tbody.empty();
        for (let i = 0; i < result.globals.length; i++) {
            newDefaultRow(result.globals[i].handle, result.globals[i].content);
        }
    }
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

/**
 * 
 * @param {*} csv Object containing a list of finalized role-cards.
 */
function processFinalizedRoleCards(csv, isRand = false) {
    ROLE_LIST = csv;
    var container = $("#result-container");
    container.empty();
    var comb = "";
    var list = [];
    for (var i = 0; i < csv.length; i++) {
        var result = createExportSection(`Role #${i+1}`, i+1, csv[i]);
        comb += csv[i];
        list.push(result);
    }
    if (csv.length > 1) container.append(createExportSection("All Roles", "all_roles", comb));
    for (var i = 0; i < list.length; i++) {
        container.append(list[i]);
    }
}
function processRandedRoleCards(list) {
    var container = $("#result-container");
    container.empty();
    var flist = [];
    for (var i = 0; i < list.length; i++) {
        var result = createRandExport(list[i].player, i+1, list[i].role);
        flist.push(result);
    }
    for (var i = 0; i < flist.length; i++) {
        container.append(flist[i]);
    }
}
//#endregion

/**
 * Creates a link directly to send a private message to users, only works on already
 * accepted websites. Currently Town of Salem and Mafia Scum
 * @param {string} website Website type, interpreted as null if unknown or blank. 
 * @param {*} users Array of usernames to send to.
 * @param {*} subject Subject of private message.
 * @param {*} message Content of private message.
 */
function generateForumPM(website, users, subject, message) {
    var link = "";

    var recipient = "";
    for (var i = 0; i < users.length; i++) {
        recipient += users[i];
        if (!(i < users.length)) recipient += ",";
    }

    recipient = (recipient === "") ? "Trash Can" : recipient;
    var cleanedRecipient = encodeURIComponent(recipient);
    var cleanedSubject = encodeURIComponent(subject);
    var cleanedMessage = encodeURIComponent(message);
    
    switch (website) {
        case "tos":
            link = `https://www.blankmediagames.com/phpbb/ucp.php?i=pm&mode=compose&username_list=${cleanedRecipient}&subject=${cleanedSubject}&message=${cleanedMessage}`;
            break;
        case "ms":
            link = `https://forum.mafiascum.net/ucp.php?i=pm&mode=compose&username_list=${cleanedRecipient}&subject=${cleanedSubject}&message=${cleanedMessage}`;
            break;
    }
    return link;
}


io.on('parse-card', (data) => {
    processFinalizedRoleCards(data.list);
});
io.on('rand', ({ rand }) => {
    processRandedRoleCards(rand);
})

function openTab(evt, page) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(page).style.display = "block";
    evt.currentTarget.className += " active";
}
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
    var arr, tmp, i, $nodes = $(sel);
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

function setCookie(cname, cvalue, exdays) {
    var expires = "";
    if (exdays !== undefined && exdays !== null) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        expires = "expires=" + d.toUTCString();
    }
    var cookie = `${cname}=${cvalue};`;
    if (expires !== "") {
        cookie += `${expires};`
    }
    cookie += `path=/`;
    document.cookie = cookie;
}

function getCookie(cname) {
    var name = `${cname}=`;
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}