function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrlen == 0) return [];

    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index =str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

/* Serialize a HTML Form Completely */
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

/* Convert a Serialized Form into an Object */
function serialToObject(serial) {
    var array = {};
    $.each(serial, (i, field) => {
        array[field.name] = field.value;
    });
    return array;
}

/**
 * Opens link in a seperate tab.
 * @param {*} url URL to open
 */
function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

/**
 * Copy text to the clipboard.
 * @param {*} text Text to copy
 */
function clipboardCopy(text) {
    var tmp = document.createElement("textarea");
    document.body.appendChild(tmp);
    tmp.value = text;
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
}
