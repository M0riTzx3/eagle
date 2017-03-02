SET deploy_location=C:\Users\AA07511\tvapps\Eagle360Runner
xcopy /s js %deploy_location%\js /y /V
xcopy /s images %deploy_location%\images /y /V
xcopy /s styles %deploy_location%\styles /y /V
xcopy appinfo.json %deploy_location% /y
xcopy game.html %deploy_location% /y
xcopy icon.png %deploy_location% /y
xcopy index.html %deploy_location% /y
xcopy phaser.html %deploy_location% /y
xcopy selectplayer.html %deploy_location% /y