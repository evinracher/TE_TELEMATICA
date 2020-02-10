# TE_TELEMATICA

Este repositorio es para guardar los projectos desarrollados en la materia "Tópicos especiales en telemática". Cada proyecto tiene su propia carpeta y su archivo README.txt con información adicional. A continuación unas respuestas de documentación básica para los proyectos.

Proyecto 1:


### ¿CUALES SON LOS REQUISITOS FUNCIONALES DE LA APP?

El sistema debe:

* Permitir al usuario guardar y visualizar las mediciones que se hagan de temperatura y humedad en una posición dada, mediante el uso de un API REST.
* Permitir al usuario acceder al sistema de visualización con un usuario y una contraseña.
* Visualizar a qué distancia de la posición previamente indicada están los diferentes lugares cercanos a un área de interés con su temperatura y humedad.
* Permitir al usuario enviar, actualizar, eliminar y obtener mediciones mediante una API REST autenticada con un json web token, que se le asignará y que se borrará pasado un tiempo determinado.
* Registrar usuarios y proporcionar un sistema de logueo para que los usuarios registrados puedan utilizar el sistema.
* Generar tokens para que los usuarios puedan utilizar la API REST desde una aplicación por medio de peticiones al servidor.
* Almacenar la información de los usuarios y los registros en una base de datos para posterior consulta.

### ¿CUALES SON LOS REQUISITOS NO FUNCIONALES DE LA APP?

El sistema debe:

* Ser seguro: solo los usuarios con un username y password válido pueden acceder al sistema. Además se debe verificar que solo estos usuarios puedan utilizar los servicios proporcionados por el API REST.
* Estar disponible el 99% en que un usuario quiera acceder.
* Tener un tiempo máximo de aprendizaje para su uso de una hora.
* Ser responsive, de manera que se pueda visualizar en dispositivos móviles y computadores.
* Tener un tiempo de respuesta de las peticiones a la API REST de máximo 2 segundos.
* Actualizar los cambios en base de datos en menos de 2 segundos.
* Mantener los tokens de acceso generados para los servicios de API válidos por un tiempo máximo de una hora.
* Proporcionar mensajes de error al usuario cuando algo salga mal o realice mal una operación

### ¿QUÉ TECNOLOGÍA DE DESARROLLO UTILIZÓ?

Para el backend se utilizó nodejs como framework de desarrollo. Para la base de datos se utilizó el motor mongodb. Para el frontend se utilizó reactjs como framework de desarrollo.

#### EN EL BACKEND?

Se utilizaron los siguientes paquetes en nodejs:

express: Para desarrollar la aplicación de forma más fácil.
mongoose: Para conexión a base de datos.
bcrypt: Para encriptar las contraseñas de los usuarios en el sistema.
body-parser: Para procesar los JSONs que se envían en las peticiones y respuestas.
dotenv: Para almacenar las claves que se utilizan para generar los JWTs.
jsonwebtoken: Para generación de JWTs.

#### EN EL FRONTEND?
Se utilizaron los siguientes paquetes en reactjs:

babel: Para la compilación del código de javascript en las vistas y archivos html.

Y se utilizó bootstrap como plantilla para las vistas css y html.

### ¿CUALES SON Y CUAL ES LA ESPECIFICACIÓN DE LOS SERVICIOS API REST DEL BACKEND?
Se implementaron los servicios POST, GET, DELETE y PUT.

**POST** bajo la ruta /api/registries/ y el objeto a crear en la base de datos en el body.
**GET** bajo la ruta /api/registries/ y devuelve los registros de acuerdo a unos parámetros que se le pasen, que es la longitud y latitud de un punto del cual se quiere saber cuales son los registros cercanos (1000 mts a la redonda) que se tienen en la base de datos.
**DELETE** bajo la ruta /api/registries/:id y borra el registro identificado con el parámetro :id
**PUT** bajo la ruta /api/registries/:id y permite actualizar el registro identificado con el parámetro :id, y los parámetros a actualizar en el body.

### ¿CÓMO REALIZÓ LA AUTENTICACIÓN DE LOS SERVICIOS API REST?
Se realizó la autenticación de los servicios usando el paquete jsonwebtoken (JWT), que permite generar tokens para los usuarios una vez ingresen a la aplicación. Se genera un token aleatorio y se establece en un documento de ambiente utilizando el paquete dotenv. para que el usuario lo utilice. Este token tiene un tiempo de duración determinado después del cual se debe generar uno nuevo. Al salir (utilizando un servicio del servidor), el token se elimina y el usuario tiene que volver a loguearse para generar otro. Todo el manejo de autentificación para los servicios de API REST (logueo y generación de tokens) se realiza en un servidor aparte (authServer.js) del servidor del api.
