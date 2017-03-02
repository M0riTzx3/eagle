import $ from "jquery"
import trackEvent from "./googleAnalytics"
import smafLoader from "./smafLoader"

const selectAbleTires = [];
var selectedTireDefault = 0;
function init(){
    loadTires();
    hideAllTires();
    showTire(selectAbleTires[selectedTireDefault]);
    Smaf.ready(() => {
        Smaf.on('action', tireSelection);
    });
}

function tireSelection(event){
    if(event.type==="keyDown"){

        if(event.keyCode === 13 || event.command==="ENTER"){
            var paramsToForward = {
                road:"dryRoad",
                tire:selectAbleTires[selectedTireDefault]
            }
            trackEvent({
                category: "game-start",
                action: "Game starts with road: "+paramsToForward.road+" and tire: "+paramsToForward.tire
            });
            window.location = "/game.html?"+$.param(paramsToForward);


        }

        if(event.command==="BACK"){
            window.location ="/index.html";
        }


        if(event.command==="LEFT"){
            hideTire(selectAbleTires[selectedTireDefault]);
            if(selectedTireDefault ==0){
                selectedTireDefault=selectAbleTires.length-1;
            }else{
                selectedTireDefault--;
            }

            showTire(selectAbleTires[selectedTireDefault]);

        }else if(event.command==="RIGHT"){
            hideTire(selectAbleTires[selectedTireDefault]);
            if(selectedTireDefault+1 >=selectAbleTires.length){
                selectedTireDefault=0;
            }else{
                selectedTireDefault++;
            }
            showTire(selectAbleTires[selectedTireDefault]);
        }

    }

}


function loadTires(){
    var tireImageTags = $("#tire-selection-chooser article img");

    for(var i=0;i<tireImageTags.length;i++){
        console.log($(tireImageTags[i]));
        var imageTag = $(tireImageTags[i]);

        selectAbleTires.push($(imageTag).attr("id"));
    }
}

function hideAllTires(){
    for(var i=0; i<selectAbleTires.length;i++){
        hideTire(selectAbleTires[i]);
    }
}

function hideTire(tireIdToHide){
    $("#"+tireIdToHide).removeClass("selected");
    $("#"+tireIdToHide+"-description").hide();
}

function showTire(tireIdToShow){
    $("#"+tireIdToShow).addClass("selected");
    $("#"+tireIdToShow+"-description").show();
}



$(document).ready(function(){
    ga('send', 'pageview');
    smafLoader();
    init();
});

