SET deploy_location=C:\Users\AA07511\tvapps\Eagle360RunnerShadow
ECHO ON
ECHO %deploy_location%
ECHO HI
xcopy /s js %deploy_location%\js /y/V
xcopy /s/y images %deploy_location%\images /y/V
xcopy /s/y styles %deploy_location%\styles /y/V
xcopy appinfo.json %deploy_location% /y
xcopy game.html %deploy_location% /y
xcopy icon.png %deploy_location% /y
xcopy index.html %deploy_location% /y
xcopy phaser.html %deploy_location% /y
xcopy selectplayer.html %deploy_location% /y