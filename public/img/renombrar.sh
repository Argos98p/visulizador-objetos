 #!/bin/bash
 ################################
 # renombrar.sh                 #
 # script renombramiento masivo #
 # numerando desde 1            #
 ################################
 cont=0
 nombre="control_"
 for picture in `ls *.jpg | sort -V`
 do
 cont=$((cont+1))
 nuevonombre=$nombre$cont
 echo "Renombrando... $picture"
 echo "a $nuevonombre.jpg"
 mv $picture $nuevonombre.jpg
 done
