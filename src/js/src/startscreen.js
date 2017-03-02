import trackEvent from "./googleAnalytics"
import smafLoader from "./smafLoader"
import $ from "jquery"

var selectedItem = 'startgame';
var score = 0;
var storageScore = 0;
var highscore = 0;

function init() {
    smafLoader();
    Smaf.ready(() => {
        checkQuerys();
        Smaf.on('action', menuControls);
    });
    
    
}

function checkQuerys() {
    var search = document.location.search;
    if(search !== '') {
        setScore(getQueryParams(document.location.search).score);
    }
}

function setScore(searchscore) {
    if(searchscore !== undefined) {
        score = searchscore;
        trackEvent({
            category: "game-end",
            action: "Game ended with a score of " + score + " points."
        });
        handleStorageScore();
        $("#score").removeClass("invisible");
    }
}

function handleStorageScore() {
    Smaf.storage().getItem('highscore', function(err, value) {
        storageScore = parseInt(value);
        console.log(storageScore);
        if(score > storageScore) {
            storeScore();  
        } else {
            highscore = storageScore;
        }    
        $("#score").html("<h1>You earned " + score + " Points!</h1></br><h1>Highscore: " + highscore);
       
    });
}

function storeScore() {
    Smaf.storage().setItem("highscore", score);
    highscore = score;
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
                Smaf.storage().setItem("highscore", this.score);
            }
        }
    } 
}

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

