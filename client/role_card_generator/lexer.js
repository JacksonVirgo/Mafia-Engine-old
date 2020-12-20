function lexer(data, temp) {
    var template = temp;
    var roleArray = data;
    var namesArray = [];
    for (var property in roleArray) {
        namesArray.push(property);
    }


    // Add all of the data information into the template.
    for (var i = 0; i < namesArray.length; i++) {
        template = template.replaceAll(`{{${namesArray[i]}}}`, roleArray[namesArray[i]]);
    }

    // Search for the list of boolean sections.
    
    
    // Return the final text
    return template;
}


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