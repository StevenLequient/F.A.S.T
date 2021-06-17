## Ballistix *(aka Fire.A.S.T)*
**Description:**
Ce projet gère le tir depuis la tourelle du vaisseau, en se connectant au serveur et en utilisant la webcam afin d'enregistrer la position d'une balle de scratch tirée sur une cible en tissu adapté, en en repérant la couleur.

**Requis:**
*Ce projet C++ nécessite Opencv, de version 2.8 au moins afin de fonctionner, ainsi qu'une webcam.*
*Des conditions idéales d'éclairage sont conseillées.*

**Pour compiler le projet:**
cmake .
make

**Pour exécuter le projet:**
./ballistix [ip_du_serveur] [Optionnel : search_ball_only]

**Fonctionnement:**
L'application a deux façon de fonctionner, selon la présence ou non du troisième paramètre optionnel.
**Si le troisième paramètre est donné**, l'application affiche 4 croix vertes, représentant les 4 coins où il est nécessaire de fixer la cible, et ne repère alors que la balle.
**Si le troisième paramètre n'est pas donné**, l'application recherche trois marqueurs de la même couleur afin de repérer la cible et sa taille, un coin par quart de l'écran, à savoir en haut à gauche, en haut à droite, et en bas à droite. On peut voir que l'application à repéré les trois repères et la balle, par les indicateurs du coin supérieur gauche,

Quand les éléments nécessaires sont repérés pendant 10 frames (réglable dans le code), afin de s'assurer qu'il ne s'agit pas simplement d'une erreur, la précision du tir est calculée, puis la réponse est envoyée au serveur.
L'application ne détecte alors plus pendant 200 frames (réglable dans le code), temps largement nécessaire pour marcher vers la balle, la détacher de la cible, et s'écarter de la caméra avant qu'elle ne recommance à détecter.
Il redevient alors à nouveau possible de tirer.

**Calibration:**
A l'execution du projet, plusieurs fenêtres se lancent.
Une représente la caméra, avec des croix représentant les objets détectés.
Deux représentent des valeurs HSV minimum et maximum réglables avec des curseurs, chacune correspondant à une backprojection, à savoir les éléments filmées dont la couleur sont compris entre ces minimum et maximums.
De base, l'application est prévue pour détecter une balle rouge et des repères de cible verts, dans une pièce obscure éclairée par une lumière forte.
Lors de la calibration, l'objectif est de n'afficher sur la backprojection que les éléments que l'on cherche à détecter, sans autres objets ni bruit, en définissant les minimums et maximums de teinte(H), saturation(S) et valeur(V).
En cas de problème, n'hésitez pas à vous aider d'un color picker HSV pour vous aider.

**Si vous n'arrivez pas à installer OpenCV, il est possible de télécharger la VM du cours de Computer Vision:**

> Pour cet enseignement, il est nécessaire d'avoir installé la librairie
> OpenCV en version 3.3 (ou supérieur) que vous pouvez télécharger sur
> le site 
> [officiel](https://github.com/opencv/opencv/releases/tag/3.3.0)  ainsi
> que les "contrib"s (opencv_contrib). Il ne reste plus qu'à l'installer
> sur votre ordinateur, ce qui peut prendre un certain temps. Après
> l'avoir téléchargée, vous pourrez suivre 
> [ici](http://docs.opencv.org/3.3.0/df/d65/tutorial_table_of_content_introduction.html)
> les instructions d'installations selon votre système d'exploitation.  
> 
> Vous aurez besoin de  **cmake**  pour préparer la compilation. Afin de
> compiler les exemples, il suffit d'invoquer cmake avec l'option:  
> 
> `-DBUILD_EXAMPLES=ON`
> 
> Il suffit ensuite d'exécuter les commandes habituelles:  `make`  puis 
> `sudo make install`  
> 
> La librairie OpenCV possède un bon nombre de dépendances mais toutes
> ne sont pas nécessaires.
> 
> Après l'installation, utilisez un des nombreux exemples pour la
> vérifier.
> 
> (Pour les installations sous Windows 10 : vous trouverez
> l'installation de PathEditor 
> [ici](https://moodle.polytech.unice.fr/pluginfile.php/64/course/section/41/PathEditor.exe)).
> 
> En cas d'échec, on vous fournira une  [machine virtuelle Ubuntu 17.04
> avec OpenCV
> 3.3](http://www.i3s.unice.fr/~lingrand/PNSwithOpenCVandpcl.ova). Vous devrez avoir installé virtualbox et les extensions (voir la page de 
> [Stéphane
> Lavirotte](http://stephane.lavirotte.com/teach/vm/install.html)  si
> vous ne l'avez pas déjà) et avoir 30 Go de disponibles.  
> 
> Pour activer le réseau (NAT) dans la machine virtuelle:
> 
> sudo dhclient enp0s3 -v   sudo ifconfig enp0s3 up  
> #pour tester que le réseau fonctionne:   ping google.fr  
> #réponse du type:  
> #PING google.fr (216.58.210.227) 56(84) bytes of data.  
> #64 bytes from mrs04s10-in-f227.1e100.net (216.58.210.227): icmp_seq=1 ttl=50 time=15.0 ms   \# ...  
>   
> 
>   
> 
> Documentation OpenCV 3.3 :
> [http://docs.opencv.org/3.3.0/index.html](http://docs.opencv.org/3.3.0/index.html)


