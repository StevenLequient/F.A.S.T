# F.App.S.T
## Récuperer le projet 
**Prérequis** : Avoir installé [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)  
Pour récupérer le serveur, ouvrir un terminal et entrez la commande suivante  

    git clone https://github.com/NicolasBighetti/F.App.S.T

## Installer le projet
**Prérequis**: Avoir installé [npm](https://www.npmjs.com/get-npm)   
Pour installer les dépendances du projet et pouvoir le lancer, déplacez vous dans le dossier ou le projet a été cloné et entrez la commande  

    npm install

Ensuite, entrez la commande 

    cd www
    
Puis entrez de nouveau la commande

    npm install

## Build le projet
**Prérequis**: Avoir installé [cordova](https://cordova.apache.org/docs/en/latest/guide/cli/#installing-the-cordova-cli) 

Pour build le projet, déplacez vous dans le dossier ou le projet a été cloné et lancez le script reinstall.sh

    ./reinstall.sh

Si vous ne pouvez pas executer le script, changez ses permissions à l'aide de la commande suivante

    chmod +x reinstall.sh

## Installer le projet sur téléphone
**Matériel**: Téléphone Android version 5.0 minimum, équipé d'un gyroscope, d'un appareil photo, d'un micro, et d'un vibreur
**Prérequis**: [Le téléphone Android doit être en mode développeur](https://developer.android.com/studio/debug/dev-options.html)

Pour installer le projet, branchez votre téléphone en USB à votre ordinateur, puis dans le dossier du projet tappez la commande suivante

    cordova run android

Si cordova ne détecte pas votre ordinateur ne détecte pas votre téléphone, il s'agit surement d'un soucis avec adb
**Troubleshooting Linux & Mac**: https://www.farside.org.uk/200906/adb_no_devices_found  
**Troubleshooting Windows**: https://www.addictivetips.com/android/android-device-is-not-listed-after-adb-devices-command/

## Lancer le projet

Cliquez sur l'icône FAST dans le lanceur d'application du téléphone ou l'application a été installé.
![Icone du jeu FAST](https://raw.githubusercontent.com/NicolasBighetti/F.App.S.T/master/screen/fast.png)

# Contributeurs
Alison BERLIOZ
Nicolas BIGHETTI
Flavian JACQUOT
Steven LEQUIENT



