/* SocketIO */
//#region 
const serverLink = true ? "http://localhost:2000" : "https://fmhelp.herokuapp.com/";
var io = io(serverLink);
io.on('parse-card', (data) => {
    processFinalizedRoleCards(data.list);
});
io.on('rand', (data) => {
    processRandedRoleCards(data.rand);
});
io.on("replace", (data) => {
    console.log(data);
});
//#endregion


/* JQuery*/
// Singleton item for when Fields are being editied.
const roleListTable = [];

const FIELD_SINGLETON = { focus: undefined, list: [], modal: $("#fieldModal") };
const FIELD_TEMPLATES = { list: [] };
const DEFAULTS = {};
var ROLE_LIST = null;

$.getJSON("./rolecard/data/defaults.json", (json) => {
    for (const property in json) {
        DEFAULTS[property] = json[property];
    }
}).then(() => {
    let { form, submit } = DEFAULTS.jquery;
    $(form.csv).on("submit", csvRoles);
    $(form.singular).on("submit", singularRole);
    $(form.rand).on("submit", rand);
    $(form.save).on("submit", saveData);
    $(form.load).on("submit", loadData);
    $(submit.addField).on("click", addField);
    $(submit.sendPM).on("click", sendPM);
    $(submit.newGlobalBtn).on("click", (e) => {newGlobalBlank()});
    initFieldModal();
    for (let field of DEFAULTS.fields) {
        $(form.singular).append(createSingularField(field.name, field.handle)).append($(submit.singular));
    }
    $(DEFAULTS.jquery.template).val(DEFAULTS.template);
    for (const property in DEFAULTS.global) {
        newGlobal(property, DEFAULTS.global[property]);
    }
});

/**
 * Parses an uploaded CSV file and sends it to the Parser.
 * @param {*} e JQuery Event
 */
function csvRoles(e) {
    e.preventDefault();
    let fileList = document.getElementById("csvFile").files[0];
    Papa.parse(fileList, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
            let roles = [];
            for (const data of res.data) {
                roles.push(data);
            }
            parseRoles(roles);
        }
    })
}

/**
 * Converts data into an CSV format and sends it to the Parser.
 * @param {*} e JQuery Event
 */
function singularRole(e) {
    e.preventDefault();
    let array = serialToObject(DEFAULTS.jquery.form.singular);
    parseRoles([array]);
}

/**
 * Sends all details to rand the game to the server.
 * Requires a setup to already been formatted.
 * @param {*} e JQuery Event
 */
function rand(e) {
    e.preventDefault();
    let array = serialToObject(DEFAULTS.form.rand);
    io.emit("rand", {players: array["playerList"], list: ROLE_LIST});
}

/**
 * Saves all relevant information to a JSON file for
 * the client to download.
 * @param {*} e JQuery Event
 */
function saveData(e) {
    e.preventDefault();
    let template = $(DEFAULTS.jquery.template).val();
    let globals = getObjectFromGlobals();
    download({ template: template, globals: globals }, "save.json", "text/plain");
}

/**
 * Uploads a JSON file and loads all relevant information from
 * the client.
 * @param {*} e JQuery Event 
 */
function loadData(e) {
    e.preventDefault();
    let result = null;
    let file = document.getElementById("loadFile").files[0];
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {
        result = JSON.parse(evt.target.result);
        $(DEFAULTS.jquery.template).val(result.template);
        $(`${DEFAULTS.jquery.misc.globals} > tbody`).empty();
        for (let i = 0; i < result.globals.length; i++) {
            newGlobal(result.globals[i].handle, result.globals[i].content);
        }
    };
}

/**
 * 
 * @param {*} e JQuery Event
 */
function addField(e) {
    let label = $("<label/>");
    let component = $("<input/>");
    let id = `custom${currentCustoms}`;
    component.attr("id", id);
    component.attr("name", id);
    label.attr("for", id);
    label.text(id);
    $(DEFAULTS.jquery.form.singular).append(label).append(component).append($("#template-lbl")).append($(DEFAULTS.jquery.template)).append($(DEFAULTS.jquery.form.singular));
}

/**
 * Creates a role-table for storing data of a single role.
 * @returns JQuery Element
 */
function createSingleRoleTable() {
    let tableContainer = "#roleDataTableContainer";
    let table = $(`${tableContainer} > .template`).clone().removeClass("template");
    roleListTable.push(table);
    $("#roleDataTableContainer").append(table);
}

/**
 * Sends a message through a phpbb forum using ucp.php.
 * @param {*} e JQuery Event
 */
function sendPM(e) {
    e.preventDefault();
    let results = serialToObject(DEFAULTS.jquery.submit.sendPM);
    let usernames = results["username"];
    let users = usernames.split("\n");
    let link = generateForumPM(results.forum, users, results.subj, results.content);
    openInNewTab(link);
}

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

    $("#singularCreateField").click(() =>{
        var field = createSingularField_Empty();
        $(DEFAULTS.jquery.form.singular).append(field).append($(DEFAULTS.jquery.submit.singular));
    });
}

/**
 * Edit the details of a singular Role Field.
 * @param {*} newFocus 
 */
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

/**
 * Creates an empty Singular Role Field.
 */
function createSingularField_Empty() {
    const DEFAULT_NAME = "New Field";
    const DEFAULT_ID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    return createSingularField(DEFAULT_NAME, DEFAULT_ID);
}

/**
 * Creates a Singular Role Field with pre-set content.
 * @param {*} name Name to give the field.
 * @param {*} id ID for the field to hold.
 */
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

/**
 * Creates an Export Field with all required content.
 * @param {*} title Title displayed on the Field.
 * @param {*} id ID to reference this specific Field.
 * @param {*} content Content displayed on the Field.
 */
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

/**
 * Creates an Rand Export Field with all required content. 
 * @param {*} title Title displayed on the Field.
 * @param {*} id ID to reference this specific Field.
 * @param {*} content Content displayed on the Field.
 */
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

/**
 * Creates a new row in the Globals table with a set handle and content.
 * @param {*} handle Handle to be shown.
 * @param {*} content Content to be shown.
 */
function newGlobal(handle, content, handlePreview="") {
    let row = $("<tr />");
    let handCell = $("<td />");
    let contCell = $("<td />");
    handCell.attr("contentEditable","true");
    contCell.attr("contentEditable","true");
    handCell.text(handle);
    handCell.attr("placeholder", handlePreview);
    contCell.text(content);
    row.append(handCell).append(contCell);
    $("#defaultTable > tbody").append(row);
}

/**
 * Creates an empty row in the Globals table.
 */
function newGlobalBlank() {
    newGlobal("-empty-", "Content");
}

/**
 * Request the server to format roles, sanitises information to be sent
 * efficiently in one package.
 * @param {*} roles Object of values for the roles.
 */
function parseRoles(roleList) {
    io.emit("parse-card", {block: $("#role_template").val(), globals: getObjectFromGlobals(), list: roleList});
}

/**
 * Returns an Object containing all values from the Globals table.
 * @returns a list of objects. id, handle, content.
 */
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

/**
 * Saves a string to file on the clients system.
 * @param {*} content Text to save to file.
 * @param {*} fileName The default file name that appears on the save file form.
 * @param {*} contentType Type of file to save.
 */
function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

/**
 * Creates objects/elements to display a list of finalized role cards within
 * the exports section.
 * @param {*} csv Object containing a list of finalized role-cards.
 */
function processFinalizedRoleCards(csv, isRand = false) {
    ROLE_LIST = csv;
    var container = $("#exportedResultContainer");
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

/**
 * Creates elements to display the list of randed role-cards within the randed section.
 * @param {*} list List containing all of the role-cards and players associated with them.
 */
function processRandedRoleCards(list) {
    let container = $("#randedResultContainer");
    container.empty();
    let flist = [];
    let combined = "";
    for (var i = 0; i < list.length; i++) {
        var result = createRandExport(list[i].player, i+1, list[i].role);
        combined += list[i].role;
        flist.push(result);
    }
    if (list.length > 1) container.append(createExportSection("All Roles", "all_roles", combined));
    for (var i = 0; i < flist.length; i++) {
        container.append(flist[i]);
    }
}

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

/**
 * Sets focus on a specific tabbed content.
 * @param {*} evt JQuery Event
 * @param {*} page ID of the page to focus
 */
function openTab(evt, page) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        console.log(`${tabcontent[i].parentElement.id} - ${evt.currentTarget.parentElement.parentElement.id}`);
        if (tabcontent[i].parentElement.id === evt.currentTarget.parentElement.parentElement.id) {
            tabcontent[i].style.display = "none";
        }
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].parentElement.parentElement.id === evt.currentTarget.parentElement.parentElement.id) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }
    document.getElementById(page).style.display = "block";
    evt.currentTarget.className += " active";
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