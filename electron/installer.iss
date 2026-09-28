; =====================================================================
; SCRIPT INNO SETUP : Gestion_Centre_Deuxieme_Chance_Setup.exe
; Installateur Windows professionnel pour le PC SERVEUR
; =====================================================================

#define MyAppName "Gestion Centre Deuxième Chance"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Centre Deuxième Chance"
#define MyAppURL "http://localhost:3000"
#define MyAppExeName "GestionCentreDeuxiemeChance.exe"

[Setup]
AppId={{D41A56F7-009A-4E38-924A-95BDCF0319EE}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName=C:\GestionDeuxiemeChance
DisableDirPage=no
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=no
OutputDir=..\dist-installer
OutputBaseFilename=Gestion_Centre_Deuxieme_Chance_Setup
SetupIconFile=icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce
Name: "startmenushortcut"; Description: "Créer un raccourci dans le Menu Démarrer"; Flags: checkedonce
Name: "firewallrule"; Description: "Configurer automatiquement le Pare-feu Windows (Port 3000)"; Flags: checkedonce
Name: "autostart"; Description: "Démarrer automatiquement le serveur avec Windows"; Flags: unchecked

[Files]
Source: "..\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "node_modules\.cache\*,dist-installer\*,dist-electron\*"

[Dirs]
Name: "{app}\database"
Name: "{app}\backups"
Name: "{app}\documents"

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\scripts\demarrer-serveur.bat"; IconFilename: "{app}\electron\icon.ico"
Name: "{group}\Configurer Pare-feu"; Filename: "{app}\scripts\installer-firewall.bat"
Name: "{group}\Dossier Sauvegardes"; Filename: "{app}\backups"
Name: "{group}\Désinstaller {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\scripts\demarrer-serveur.bat"; IconFilename: "{app}\electron\icon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\scripts\installer-firewall.bat"; StatusMsg: "Configuration du pare-feu Windows pour le réseau local..."; Tasks: firewallrule; Flags: runhidden
Filename: "{app}\scripts\demarrer-serveur.bat"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
