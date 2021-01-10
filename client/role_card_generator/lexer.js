
function lexer(data, temp) {
  var template = temp;
  roleArray = data;
  var namesArray = [];
  for (var property in roleArray) {
    namesArray.push(property);
  }

  // Add all of the data information into the template.
  for (var i = 0; i < namesArray.length; i++) {
    template = template.replaceAll(`{{${namesArray[i]}}}`, roleArray[namesArray[i]]);
  }

  var charArray = Array.from(template);
  // Search for the list of boolean sections.

  var commandOpenArray = [];
  var commandOpenAwaitingClose = undefined;

  function compareTwoChar(array, index, check) {
    return (array[index] + array[index+1] === check);
  }
  for (var i = 0; i < charArray.length; i++) {
    var commandOpen = compareTwoChar(charArray, i, "[[");
    var commandClose = compareTwoChar(charArray, i, "]]");

    if (commandClose && commandOpenAwaitingClose !== undefined) {
      commandOpenArray.push(template.substring(commandOpenAwaitingClose+2, i));
    }
    
    if (charArray[i] === "[" && charArray[i+1] === "[") {
      commandOpenArray.push(i+2);
    } else if (char) {

    }
  }
    
    // Return the final text
    return template;
}


