
function initSmaf(){
    Smaf.init('djtarACtB7ctRf3AthuQoN6QZTyQA7MZ');
    Smaf.ready(() => {
        Smaf.on('action', volumeControl);
    });
}

function volumeControl(event){

    if(event.type==="keyDown"){
        if(event.command==="VOL_UP"){
            var audio = document.getElementsByTagName("audio")[0]
            if(audio.volume < 1){
                audio.volume += 0.1;
            }
        }
        if(event.command==="VOL_DOWN"){
            var audio = document.getElementsByTagName("audio")[0]
            if(audio.volume >= 0.1){
                audio.volume -= 0.1;
            }
                
        }
    }


}

export default initSmaf
