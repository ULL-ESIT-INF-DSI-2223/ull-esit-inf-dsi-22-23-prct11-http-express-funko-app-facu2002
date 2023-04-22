# Práctica 11 - Creación de una aplicación Express para gestionar el registro de Funko Pops

## Facundo José García Gallo

<p align="center">
  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-facu2002/actions/workflows/node.js.yml">
    <img alt="Tests" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-facu2002/actions/workflows/node.js.yml/badge.svg">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-facu2002/actions/workflows/coveralls.yml">
    <img alt="Coveralls" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-facu2002/actions/workflows/coveralls.yml/badge.svg">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-facu2002/actions/workflows/sonarcloud.yml">
    <img alt="Sonar-Cloud" src="https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-facu2002/actions/workflows/sonarcloud.yml/badge.svg">
  </a>
</p>


## Índice

1. [Introducción](#introducción)
2. [Ejercicio 1](#ejercicio-1)
5. [Modificación](#modificación)
6. [Conclusión](#conclusión)
7. [Bibliografía](#bibliografía)

### Introducción

En esta práctica se nos pide realizar las funciones anteriormente realizadas para la clase Funko pero con la utilización de un servidor Express. Para ello, debemos realizar sobre él, diferentes tipos de peticiones http. Además, en la modificación se nos pide que se pueda ejecutar un comando en el servidor a partir de una petición http GET.

> **Nota:** para poder ejecutar las pruebas, hay que tener en cuenta que el servidor debe estar ejecutándose, ya que las pruebas se realizan sobre el servidor.


### Ejercicio 1

Para la realización de este ejercicio lo primero que hice fue crear un servidor express, a continuación gestiono las peticiones http GET desde la ruta `/funkos` gracias al uso de la función `route`, la cual me permite gestionar las peticiones http GET, POST, DELETE y PATCH desde la misma ruta. A continuación se muestra un esquema de lo que utilicé en la práctica:

```typescript
1    const app = express();
2    
3    app.route('/funkos')
4      .get();
5      .post();
6      .delete();
7      .patch();
```

Adentrándonos en cada una de las funciones podemos ver lo siguiente:

Para el caso en el que se desea mostrar la información de los funkos hay que tener una cosa clara, la información se puede mostrar sobre un único funko concreto de un usuario o se puede mostrar la lista entera de funkos de un usuario. ¿Cómo podemos distinguir qué quiere realizar el usuario? Fácil, si el usuario pasa en la petición la id del funko del que quiere la información, significa que el usuario solo quiere ver la información de un funko, si el usuario solo pasa el nombre del usuario, quiere ver la lista de funkos de ese usuario. Para ello, declaro una variable id, si esta variable no es undefined se mostrará la información de un funko concreto, aquel cuyo id coincida. Para ello hago uso de la función `mostrarFunkoDB`, la cual devuelve el funko en cuestión o un array vacío si no lo encuentra.

```typescript
1    if(id !== undefined) {
2      const usuario = req.query.usuario as string;
3      let respuesta: ResponseType = { success: false, type: Action.Read, info: "", funkoPops: undefined };
4      if(ManejadorJSON.mostrarFunkoDB(parseInt(id), usuario).length === 0) {
5        respuesta = { success: false, type: Action.Read, info: "Ocurrió un error.", funkoPops: undefined };
6      } else {
7        const funko = ManejadorJSON.mostrarFunkoDB(parseInt(id), usuario);
8        respuesta = { success: true, type: Action.Read, info: "Mostrando el funko.", funkoPops: funko };
9      }
10     res.send(JSON.stringify(respuesta));
```

El otro caso es cuando el usuario quiere ver la lista de funkos de un usuario, para ello hago uso de la función `listarFunkoDB`, la cual devuelve un array con todos los funkos de un usuario o un array vacío si no hay funkos de ese usuario.

```typescript
1    } else if(id === undefined) {
2        const usuario = req.query.usuario as string;
3        let respuesta: ResponseType = { success: false, type: Action.List, info: "", funkoPops: undefined };
4        if(ManejadorJSON.listarFunkoDB(usuario).length === 0) {
5          respuesta = { success: false, type: Action.List, info: "Ocurrió un error.", funkoPops: undefined };
6        } else {
7          const funkoVector = ManejadorJSON.listarFunkoDB(usuario);
8          respuesta = { success: true, type: Action.List, info: "Mostrando la lista de funkos.", funkoPops: funkoVector };
9        }
10       res.send(JSON.stringify(respuesta));
```

En cualquier otro caso se mostrará un mensaje de error.

```typescript
1    } else {
2      res.send(JSON.stringify({ success: false, funkoPops: undefined }));
```

La segunda petición que puede hacer el usuario es la de añadir un funko a la lista de funkos de un usuario. Para ello hace uso de la petición http POST. A partir de los argumentos que se pasan en la petición se construye un objeto de tipo Funko, el cual se añade a la lista de funkos de un usuario gracias al uso de la función `agregarFunkoDB`. Si la función devuelve true, significa que se ha añadido correctamente, si devuelve false, significa que ha ocurrido algún error. 

```typescript	
1    .post((req, res) => {
2      const usuario = req.query.usuario as string;
3      const id = parseInt(req.query.id as string);
4      const nombre = req.query.nombre as string;
5      ...
6      const funko = new Funko(id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas, valor);
7
8      if(ManejadorJSON.agregarFunkoDB(funko, usuario)) {
9        respuesta = { success: true, type: Action.Add, info: "Se añadió el funko a la colección del usuario.", funkoPops: undefined };
10     } else {
11       respuesta = { success: false, type: Action.Add, info: "Ocurrió un error", funkoPops: undefined };
12     }
13     res.send(JSON.stringify(respuesta));
14   })
```


Otra funcionalidad que puede experimentar el usuario es la de eliminar un funko de la lista de funkos de un usuario. Para ello realiza una petición http de tipo DELETE. Para ello, se hace uso de la función `eliminarFunkoDB`, la cual recibe como argumentos el id del funko que se quiere eliminar y el nombre del usuario. Si la función devuelve true, significa que se ha eliminado correctamente, si devuelve false, significa que ha ocurrido algún error.

```typescript
1    .delete((req, res) => {
2      const usuario = req.query.usuario as string;
3      const id = req.query.id as string;
4      let respuesta: ResponseType = { success: false, type: Action.Remove, info: "", funkoPops: undefined };
5      if(ManejadorJSON.eliminarFunkoDB(parseInt(id), usuario)) {
6        respuesta = { success: true, type: Action.Remove, info: "Se eliminó el funko de la colección del usuario.", funkoPops: undefined };
7      } else {
8        respuesta = { success: false, type: Action.Remove, info: "Ocurrió un error.", funkoPops: undefined };
9      }
10     res.send(JSON.stringify(respuesta));
11   })
```

La última funcionalidad de la que goza el usuario es la de modificar un funko de la lista de funkos de un usuario. Para ello realiza una petición http de tipo PATCH. Para ello, se hace uso de la función `modificarFunkoDB`, la cual recibe como argumentos el funko (que se construye a partir de los argumentos que recibe la petición)  y el nombre del usuario. Si la función devuelve true, significa que se ha modificado correctamente, si devuelve false, significa que ha ocurrido algún error.

```typescript
1    .patch((req, res) => {
2      const usuario = req.query.usuario as string;
3      const id = parseInt(req.query.id as string);
4      const nombre = req.query.nombre as string;
5      ...
6      const funko = new Funko(id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas, valor);
7
8      if(ManejadorJSON.modificarFunkoDB(funko, usuario)) {
9        respuesta = { success: true, type: Action.Update, info: "Se modificó el funko de la colección del usuario.", funkoPops: undefined };
10     } else {
11       respuesta = { success: false, type: Action.Update, info: "Ocurrió un error.", funkoPops: undefined };
12     }
13     res.send(JSON.stringify(respuesta));
14   });
```

Por último debemos gestionar el caso en el que no se realiza una petición correctamente debido a que se introduce una ruta incorrecta, esto lo conseguimos con el uso del método `use`, que se ejecuta cuando no se encuentra ninguna ruta que coincida con `funkos`. En este caso, se devuelve un mensaje de error 404.

```typescript
1    app.use((_, res) => {
2      res.send('<h1>404</h1>');
3    });
4    
5    app.listen(3000, () => {
6      console.log('Server is up on port 3000');
7    });
```


### Modificación

Para la realización de la modificación lo primero que hice fue crear un servidor express, a continuación gestiono las peticiones http GET desde la ruta `/execmd`. A partir de esta ruta, se recibe un parámetro principal `cmd` que es el comando que se va a ejecutar, y un parámetro opcional `args` que son los argumentos que se le pasan al comando. El hecho de no pasar argumentos implica ejecutar el comando `spawn` sin argumentos, en caso contrario se ejecuta con los argumentos pasados.

```typescript
1    const app = express();
2    app.get('/execmd', (req, res) => {
3      const cmd = req.query.cmd as string;
4      let args;
5      let ejecucion;
6      if(req.query.args !== undefined) {
7        args = req.query.args as string;
8        ejecucion = spawn(cmd, args.split(' '));
9      } else {
10       ejecucion = spawn(cmd);
11     }
```

A continuación se gestiona el caso en el que la salida es correcta, es decir, el comando existe, y si se pasan argumentos, estos son correctos. Esto quiere decir que el comando no va a provocar ningún error, por lo que el resultado emitirá un evento `data`. También tenemos que tener en cuenta que el resultado vendrá por partes, por eso, hasta que no pare de emitir eventos `data`, se almacena el resultado en la variable `salida`.

```typescript
1    let salida = '';
2    let outputError = '';
3    ejecucion.stdout.on('data', (data) => {
4      salida += data;
5    });
```

A continuación gestionamos los dos tipos de errores que pueden suceder. Por un lado, el comando introducido puede existir, pero sus argumentos no, esto se gestiona desde la línea 1 hasta la 3, ya que, aunque se emita un evento `data`, la salida no vendrá por la salida estándar, sino por la salida de error, por eso ponemos stderr y almacenamos en la variable `outputError`. Por otro lado, el comando puede no existir, por lo que se emitirá un evento `error`, y se almacenará en la variable `outputError`, del mismo modo que lo hemos hecho antes.

```typescript
1    ejecucion.stderr.on('data', (err) => {
2      outputError += err;
3    });
4  
5    ejecucion.on('error', (err) => {
6      outputError += err;
7    });
```

Además debemos gestionar la respuesta que se debe dar al cliente, que en este caso es aquel que realizó la petición http GET. Cuando el comando se haya ejecutado, habiendo dado un resultado correcto o un error, se emitirá un evento `close`, por lo que gestionamos este evento, y en función de si se ha producido un error o no, se devolverá un objeto JSON con la salida o el error, respectivamente.

```typescript
1      ejecucion.on('close', () => {
2        if(outputError.length === 0) {
3          res.send(JSON.stringify({ output: salida }));
4        } else {
5          res.send(JSON.stringify({ error: outputError }));
6        }
7      });
8    });
```

Por último debemos gestionar el caso en el que no se realiza una petición correctamente debido a que se introduce una ruta incorrecta, esto lo conseguimos con el uso del método `use`, que se ejecuta cuando no se encuentra ninguna ruta que coincida con `execmd`. En este caso, se devuelve un mensaje de error 404.

```typescript
1    app.use((_, res) => {
2      res.send('<h1>404</h1>');
3    });
4    
5    app.listen(3001, () => {
6      console.log('Server is up on port 3001');
7    });
```


### Conclusión

En conclusión puedo decir que me gustó mucho trabajar con servidores de esta manera tan sencilla, me parece mucho más intuitivo que trabajar con sockets, ya que no hay que estar gestionando la conexión y desconexión de los clientes. Además, me parece muy interesante la posibilidad de poder ejecutar comandos en el servidor a partir de una petición http GET, ya que es una manera muy sencilla de poder ejecutar comandos en el servidor sin tener que acceder a él. También me parece un tema muy interesante ya que es prácticamente el funcionamiento del mundo real, el funcionamiento de las páginas web.


### Bibliografía

[Cómo gestionar las peticiones con request](https://developer.mozilla.org/en-US/docs/Web/API/Request)

[Cómo hacer pruebas con peticiones](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-http-callback-pattern.html)
