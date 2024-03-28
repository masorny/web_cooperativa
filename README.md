# Web Cooperativa
## Requisitos (Click al nombre para descargar)
- [NodeJS](https://nodejs.org/en/download/current)

- [XAMPP](https://www.apachefriends.org/es/index.html)

## Preparación

1. Comprobacón de los programas requeridos
   - Para el caso de NodeJS, para verificar que todo se haya instalado correctamente,  
     ejecuta el `cmd` y escribre el siguiente comando: `node --version`
       
     El comando debe indicar su versión de NodeJS, por ende, la instalación ha sido correcta.  
     De caso contrario, intente reiniciar su equipo.
       
     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222793118424760323/image.png?ex=661781d5&is=66050cd5&hm=8aad7ae2e2a66ce10cd11eca2ffd8395bc8df706d2df0631dc9ff62c6c8cd852&)

   - Para el caso del XAMPP, en algunos equipos puede que necesite un reinicio obligatorio.
     Una vez instalado diríjase a inicio y escriba `xampp`, debería aparecerle el programa `XAMPP Control Panel`.
       
2. Configuración de XAMPP
     - Ejecutamos el programa `XAMPP Control Panel`  

       ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222794701955010570/image.png?ex=6617834f&is=66050e4f&hm=242521244e239e26dccf63c0f4a518a1a8978598ea4aca5094233838290bc1bb&)

       Una vez abierto, el programa desplegará esta ventana. Habilitamos las opciones marcadas

       ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222795903870566470/image.png?ex=6617846d&is=66050f6d&hm=bfa601a5ff66f7ce69410e664eaececf69d95d5d9409f61052a986cb8a0b7c5e&)

       Una vez habilitados, al iniciar ambos, estarán iluminados de un color verde, que indica que los servicios ya están activos

       ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222796256154226698/image.png?ex=661784c1&is=66050fc1&hm=e5cd562cba6ec34368c3bd9c3e2caa283c9c82c7418cdc3eb96e03c1a776c403&)

3. Configuración de Base de Datos MySQL
   - Haz click en `Admin` sobre el servicio de MySQL
      
     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222798564510662677/image.png?ex=661786e8&is=660511e8&hm=42564b8d31902529caf8919ef81c762e97e425419f9727f93acba0b388d12671&)

     Se abrirá el navegador con esta interfaz web del servidor

     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222799466340548618/image.png?ex=661787bf&is=660512bf&hm=38b92a5bfe880f3c70bc1eab012c52904769b79fe9eba32d3c016b37871e6dbb&)

     Haz click en `SQL`

     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222799624969130014/image.png?ex=661787e5&is=660512e5&hm=3909ad440c3be9e39824cfd4587a32a363c442cb01c8b5d9d75220374eb0c77c&)

     Pega la sentencia SQL en el campo y hacer click en `Continuar` o presionar `CTRL + Enter` para ejecutar código.

     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222801286856970281/image.png?ex=66178971&is=66051471&hm=94b92412bdf7143881d2c121c06a2fba4b10d58bd1d55fef1f3d9fa5d4c79f0f&)

     Una vez ejecutado, si no aparece ningún cuadro rojo con título `Error` en la parte inferior de la sentencia, significa que la ejecución se completó correctamente.

4. Descarga este proyecto
   - Puedes descargar este proyecto como ZIP de esta manera:

     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222802891513790495/image.png?ex=66178aef&is=660515ef&hm=3fcdc9a12fb28fa84f1d6ccbf97d5da156b6ca11955dc30eac17b5ed5381baff&)

     Descomprima el ZIP donde desee.

   - O bien, si tienes `Git` instalado en su equipo, cree una carpeta donde desee y copie la dirección de la carpeta.

     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222803857550217396/image.png?ex=66178bd6&is=660516d6&hm=54b18041032d19ecaf3dfd336f5d2b38a4de3669ed1e32f273b238d45e33960b&)

     Abre el `cmd` y escriba `cd <SU DIRECCION de CARPETA>`, en mi caso será `cd C:\Users\Adrian MR\Desktop\proyecto`.
     Una vez en su carpeta desde el cmd, ejecute la sentencia `git clone https://github.com/masorny/web_cooperativa.git`  
       
     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222804358681460797/image.png?ex=66178c4d&is=6605174d&hm=30e6d47516b98436ee306a0d9e48a12cb2e2b0a77a28b53ca36a5fa2f50fc9ff&)

     Y en su carpeta tendrá la carpeta `web_cooperativa` con todos sus archivos:  
       
     ![x](https://cdn.discordapp.com/attachments/1222793105183346790/1222804838656507924/image.png?ex=66178cc0&is=660517c0&hm=fed6d36701fea6d70927c8edc39988360e6e436fb3262195925b1aed6b4786d6&)

5. Ejecución
   - Una vez descargado los archivos con una de las dos formas, ejecute el archivo `start.bat`:
