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

$(document).ready(() => {
    console.log("JQuery Initialized");

    initFieldModal();

    onSubmit_SingularRole();
    onSubmit_CSVRoles();
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

function initFieldModal() {
    var close = $(".modal-close");
    close.on("click", (e) => {
        modal.css("display", "none");
    });

    $("#fieldForm").submit((e) => {
        e.preventDefault();
        var serial = serialize($("#fieldForm"));              
        var array = serialToObject(serial);
        
        console.log(currentModalFocus);

        
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


function handleCSV(results) {
    var headers = [];
    var table = [];
    var data = results.data;

    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var cells = row.join(",").split(",");

        for (var j = 0; j < cells.length; j++) {
            table[j] = ["Test", cells[j]];
        }
    }
    console.log(table);
}

function onSubmit_SingularRole() {
    $(SINGULAR_ROLE).on('submit', (e) => {
        e.preventDefault();
        console.log("Singular Role Submitted");

        var results = serialize(SINGULAR_ROLE); //$(SINGULAR_ROLE).serializeArray();
        var array = {};
        $.each(results, (i, field) => {
            array[field.name] = field.value;
        });
        var role = lexer(array, $("#role_template").val());//;generateFormattedRole(array);
        $(SINGULAR_RESULT).text(`${role}`);
    });
}
function onSubmit_CSVRoles() {
    $("#csv-role").on('submit', (e) => {
        e.preventDefault();
        var fileList = document.getElementById('csv-file').files[0];
        Papa.parse(fileList, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(res) {
                var roleText = "";
                for (var i = 0; i < res.data.length; i++) {
                    var role = generateFormattedRole(res.data[i]);
                    roleText += role;
                }
                console.log(roleText);
                $(SINGULAR_RESULT).text(`${roleText}`);
            }
        });
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

        var link = generateForumPM(array.forum, userArray, array.subj, $(SINGULAR_RESULT).val());
        console.log(link);
        openInNewTab(link);
    });
}

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