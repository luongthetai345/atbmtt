var encodedString;
function encrypt(){
    var baseString = document.getElementById("en").value;
    encodedString = window.btoa(baseString);
    document.getElementById("de").value = encodedString;
}
function move(){
    var code = document.getElementById("de").value;
    document.getElementById("de").value = document.getElementById("de1").value;
    document.getElementById("de1").value = code;
}
function decrypt(){
    var decodeString = window.atob(encodedString);
    document.getElementById("en1").value = decodeString;
}
