import trackEvent from "./googleAnalytics"
import smafLoader from "./smafLoader"

var selectedItem;

    function init() {
    smafLoader();
    checkQuerys();
        Smaf.on('action', menuControls);    
    }

    function checkQuerys() {
    var search = document.location.search;
    if(search != '') {
        setScore(getQueryParams(document.location.search).score);
    }
    }

    function setScore(score) {
    console.log(score);
    $("#score").removeClass("invisible");
    $("#score").html("<h1>You earned " + score + " Points!</h1>");
    }

    function menuControls(selection) {
    if(selection.keyCode === 38 || selection.type === 'UP') {
        $( "#exitgame" ).removeClass("selected");
        $( "#startgame" ).addClass("selected");
        selectedItem = 'startgame';
    } else if (selection.keyCode === 40 || selection.type === 'DOWN') {
        $( "#startgame" ).removeClass("selected");
        $( "#exitgame" ).addClass("selected");
        selectedItem = 'exitgame';
    } else if (selection.keyCode === 13 || selection.type === 'ENTER') {
        if(selectedItem != null) {
        if(selectedItem === 'startgame') {
            window.location.href = "selectplayer.html"
        } else {
            window.location.href = "#"
        }
        }
    }
    };

    function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

$(document).ready(function() {
    init();
});

