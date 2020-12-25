// var io = io();
// io.emit('mafiascum-page', "https://forum.mafiascum.net/viewtopic.php?f=50&t=84085");
// io.on('mafiascum-page', (data) => {
//     console.log(data);
//     $("#test-data").text(`Thread Title: ${data.header}\nCurrent Page: ${data.currentPage}\nTotal Pages: ${data.pageCount}`);
// });

SINGULAR_ROLE = "#singular-role";
SINGULAR_RESULT = "#singular-result";
SINGULAR_RESULT_COPY = "#singular-result-copy";
ROLE_COLOUR = "#rcolour";
ADD_FIELD = "#add-field";

/* Singular Specific */
GENERATE_BTN_SINGULAR = "#generate-btn-singular";

// Send as PM Form
SEND_AS_PM = "#send-as-pm";

// Singleton item for when Fields are being editied.
var currentModalFocus = undefined;
var modalFocusList = [];
var modal = $("#fieldModal");

// Individual Exports
var currentExports = [];

$(document).ready(() => {
    console.log("JQuery Initialized");

    initFieldModal();
    $("#csv-role").on('submit', (e) => onSubmit_CSVRoles(e));
    $(SINGULAR_ROLE).on('submit', (e) => onSubmit_SingularRole(e));
    onSubmit_AddField();
    onSubmit_CopyResults();
    onSubmit_SendPM();


    var rname = createSingularField("Role Name", "rname");
    var align = createSingularField("Alignment", "align");
    var salign = createSingularField("Sub-Alignment", "salign");
    var rcolour = createSingularField("Role Colour", "rcolour");
    var abilities = createSingularField("Abilities", "abilities");
    var wincon = createSingularField("Win Condition", "wincon");
    $(SINGULAR_ROLE).append(rname).append(align).append(salign).append(rcolour).append(abilities).append(wincon).append($(GENERATE_BTN_SINGULAR));
});

/* Custom Singular Fields*/
function initFieldModal() {
    var close = $(".modal-close");
    close.on("click", (e) => {
        modal.css("display", "none");
    });

    $("#fieldForm").submit((e) => {
        e.preventDefault();
        var serial = serialize($("#fieldForm"));              
        var array = serialToObject(serial);
                
        var label = currentModalFocus.children("label");
        var input = currentModalFocus.children(".field-input");

        currentModalFocus.children("label").text(array.field_name);
        currentModalFocus.children("label").attr("for", array.field_handle);

        currentModalFocus.children(".field-input").attr("id", array.field_handle);
        currentModalFocus.children(".field-input").attr("name", array.field_handle);

        // Check type has changed and if so, change it.
        var nodeName = currentModalFocus.children(".field-input").prop('nodeName');
        var nodeType = currentModalFocus.children(".field-input").attr("type");

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
        $(SINGULAR_ROLE).append(field).append($(GENERATE_BTN_SINGULAR));
    });
/*     var field = createSingularField();
    $(SINGULAR_ROLE).append(field);*/
}
function editSingularField(focus) {
    currentModalFocus = modalFocusList[focus];
    modalForm = $("#fieldForm");

    var label = currentModalFocus.children("label");
    var input = currentModalFocus.children(".field-input");

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
    modal.css("display", "block");
}

/* Singular Role Functions */
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

    modalFocusList[id] = field;
    
    button.click((e) => {
        editSingularField(id);
    });

    field.append(label).append(button).append(input);   
    return field;
}

/* Export Section Functions*/
function createExportSection(title, id, content) {
    var result = $("<div />");
    var header = $("<span />");
    var textarea = $("<textarea />");
    var revealBtn = $("<button />");
    var sendBtn = $("<button />");

    header.text(`${title}`);
    result.addClass("exportSectionDiv");
    revealBtn.attr("id", `btnReveal_${id}`);
    revealBtn.text("Reveal/Hide");
    revealBtn.bind("click", (e) => {
        var ltextarea = $(`#${e.target.id}`).parent().parent().children(".resultArea");
        ltextarea.css("display", ((ltextarea.css("display") === "block") ? "none" : "block"));
    });
    
    sendBtn.text("Send as PM");
    sendBtn.attr("id", `btnSend_${id}`);
    sendBtn.bind("click", (e) => {
        var ltextarea = $(`#${e.target.id}`).parent().parent().children(".resultArea");

        var subj = $("#subj").val();
        var play = $("#username").text();

        $("#send-as-pm").trigger("reset");
        $("#subj").val(subj);
        $("#username").text(play);
        $("#content").text(ltextarea.text());
        openTab(e, "forum");
    });

    textarea.text(content);
    textarea.addClass("resultArea");

    result.append(header);
    header.append(revealBtn);
    header.append(sendBtn);
    result.append(textarea);
    return result;
}

// Function to process the role information and display them on screen.
function setFinalArray(array) {
    $("#result-container").empty();
    var combined = "";
    var indiv = [];
    for (var i = 0; i < array.length; i++) {
        var result = createExportSection(`Role #${i+1}`, i+1, array[i]);    
        indiv.push(result);
        combined += array[i];   
    }
    var combinedObj = createExportSection("All Roles", "all_roles", combined);
    $("#result-container").append(combinedObj);
    for (var i = 0; i < indiv.length; i++) {
        $("#result-container").append(indiv[i]);
    }
}

/* Submission Functions */
function onSubmit_SingularRole(e) {
    e.preventDefault();
    var array = {};
    $.each(serialize(SINGULAR_ROLE), (i, field) => {
        array[field.name] = field.value;
    });
    processCSV([ generateFormattedRole(array) ]);
}
function onSubmit_CSVRoles(e) {
    // Collect the CSV file and convert it to an array of Objects.
    e.preventDefault();
    var fileList = document.getElementById('csv-file').files[0];
    Papa.parse(fileList, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(res) {
            var roleText = "";
            var roles = [];
            for (var i = 0; i < res.data.length; i++) {
                var role = generateFormattedRole(res.data[i]);
                roles.push(role);
                roleText += role;
            }

            processCSV(roles);
        }
    });
}
function onSubmit_AddField() {
    var currentCustoms = 0;
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
        $(SINGULAR_ROLE).append(label).append(component).append($("#template-lbl")).append($("#role_template")).append($(GENERATE_BTN_SINGULAR));
    });
}
function onSubmit_CopyResults() {
    $(SINGULAR_RESULT_COPY).click(() => {
        clipboardCopy($(SINGULAR_RESULT).text());
    });
}
function onSubmit_SendPM() {
    $(SEND_AS_PM).on('submit', (e) => {
        e.preventDefault();
        var results = serialize(SEND_AS_PM);
        var array = {};
        $.each(results, (i, field) => {
            array[field.name] = field.value;
        });

        var usernames = array["username"];
        var userArray = usernames.split("\n");

        var link = generateForumPM(array.forum, userArray, array.subj, array.content);
        console.log(link);
        openInNewTab(link);
    });
}

function processCSV(csv) {
    var container = $("#result-container");
    container.empty();
    var comb = "";
    var list = [];
    for (var i = 0; i < csv.length; i++) {
        var result = createExportSection(`Role #${i+1}`, i+1, csv[i]);
        comb += csv[i];
        list.push(result);
    }
    container.append(createExportSection("All Roles", "all_roles", comb));
    for (var i = 0; i < list.length; i++) {
        container.append(list[i]);
    }
}

/* Lexer / Parser */
function generateFormattedRole(roleArray) {

    var roleArrayTmp = roleArray;
    var template = $("#role_template").val();
    var namesArray = [];
    for (var property in roleArrayTmp) {
        namesArray.push(property);
    }

    for (var i = 0; i < namesArray.length; i++) {
        template = template.replaceAll(`{{${namesArray[i]}}}`, roleArray[namesArray[i]]);
    }

    //var result = `[area=${roleArray.align} ${roleArray.rname}][b][color=${roleArray.rcolour}]${roleArray.align} ${roleArray.rname}[/color][/b]\n[/area]`;
    return template;
}
function generateForumPM(website, users, subject, message) {
    var link = "";

    var recipient = "";
    for (var i = 0; i < users.length; i++) {
        recipient += users[i];
        if (!(i < users.length)) recipient += ",";
    }
    if (recipient === "") recipient = "Trash Can";

    var cleanedRecipient = encodeURIComponent(recipient);
    var cleanedSubject = encodeURIComponent(subject);
    var cleanedMessage = encodeURIComponent(message);
    if (website === "tos") {
        link = `https://www.blankmediagames.com/phpbb/ucp.php?i=pm&mode=compose&username_list=${cleanedRecipient}&subject=${cleanedSubject}&message=${cleanedMessage}`;
    } else if (website === "ms") {
        link = `https://forum.mafiascum.net/ucp.php?i=pm&mode=compose&username_list=${cleanedRecipient}&subject=${cleanedSubject}&message=${cleanedMessage}`;
    }
    return link;
}