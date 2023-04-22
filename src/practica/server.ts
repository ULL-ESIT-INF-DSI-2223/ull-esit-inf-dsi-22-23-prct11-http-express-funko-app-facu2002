import express from 'express';
import { ManejadorJSON } from './funko/manejadorJSON.js';
import { ResponseType, Action } from './types.js';
import { GeneroFunko, TipoFunko } from "./funko/enumerados.js";
import { Funko } from './funko/funko.js';


/**
 * Servidor Express
 */
const app = express();

/**
 * Función principal en la que se gestionan los tipos de peticiones.
 */
app.route('/funkos')

  // GET : muestra información de los funkos
  .get((req, res) => {
    const id = req.query.id as string;
    
    // Caso en el que se desea mostrar un único funko (existe un argumento que es un id)
    if(id !== undefined) {
      const usuario = req.query.usuario as string;
      let respuesta: ResponseType = { success: false, type: Action.Read, info: "", funkoPops: undefined };
      if(ManejadorJSON.mostrarFunkoDB(parseInt(id), usuario).length === 0) {
        respuesta = { success: false, type: Action.Read, info: "Ocurrió un error.", funkoPops: undefined };
      } else {
        const funko = ManejadorJSON.mostrarFunkoDB(parseInt(id), usuario);
        respuesta = { success: true, type: Action.Read, info: "Mostrando el funko.", funkoPops: funko };
      }
      res.send(JSON.stringify(respuesta));

    // Caso en el que se desea mostrar la lista de un usuario (no existe un id)
    } else if(id === undefined) {
        const usuario = req.query.usuario as string;
        let respuesta: ResponseType = { success: false, type: Action.List, info: "", funkoPops: undefined };
        if(ManejadorJSON.listarFunkoDB(usuario).length === 0) {
          respuesta = { success: false, type: Action.List, info: "Ocurrió un error.", funkoPops: undefined };
        } else {
          const funkoVector = ManejadorJSON.listarFunkoDB(usuario);
          respuesta = { success: true, type: Action.List, info: "Mostrando la lista de funkos.", funkoPops: funkoVector };
        }
        res.send(JSON.stringify(respuesta));

    // Caso error
      } else {
        res.send(JSON.stringify({ success: false, funkoPops: undefined }));
    }
  })

  // POST : añade un funko a la lista de un usuario
  .post((req, res) => {
    const usuario = req.query.usuario as string;
    const id = parseInt(req.query.id as string);
    const nombre = req.query.nombre as string;
    const descripcion = req.query.descripcion as string;
    const tipo = req.query.tipo as string as TipoFunko;
    const genero = req.query.genero as string as GeneroFunko;
    const franquicia = req.query.franquicia as string;
    const numero = parseInt(req.query.numero as string);
    const exclusivo = req.query.exclusivo as string === 'true' ? true : false;
    const caracteristicas = req.query.caracteristicas as string;
    const valor = parseInt(req.query.valor as string);
    let respuesta: ResponseType = { success: false, type: Action.Add, info: "", funkoPops: undefined };
    const funko = new Funko(id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas, valor);
    if(ManejadorJSON.agregarFunkoDB(funko, usuario)) {
      respuesta = { success: true, type: Action.Add, info: "Se añadió el funko a la colección del usuario.", funkoPops: undefined };
    } else {
      respuesta = { success: false, type: Action.Add, info: "Ocurrió un error", funkoPops: undefined };
    }
    res.send(JSON.stringify(respuesta));
  })

  // DELETE : elimina un funko de la lista de un usuario
  .delete((req, res) => {
    const usuario = req.query.usuario as string;
    const id = req.query.id as string;
    let respuesta: ResponseType = { success: false, type: Action.Remove, info: "", funkoPops: undefined };
    if(ManejadorJSON.eliminarFunkoDB(parseInt(id), usuario)) {
      respuesta = { success: true, type: Action.Remove, info: "Se eliminó el funko de la colección del usuario.", funkoPops: undefined };
    } else {
      respuesta = { success: false, type: Action.Remove, info: "Ocurrió un error.", funkoPops: undefined };
    }
    res.send(JSON.stringify(respuesta));
  })

  // PATCH : modifica un funko de la lista de un usuario
  .patch((req, res) => {
    const usuario = req.query.usuario as string;
    const id = parseInt(req.query.id as string);
    const nombre = req.query.nombre as string;
    const descripcion = req.query.descripcion as string;
    const tipo = req.query.tipo as string as TipoFunko;
    const genero = req.query.genero as string as GeneroFunko;
    const franquicia = req.query.franquicia as string;
    const numero = parseInt(req.query.numero as string);
    const exclusivo = req.query.exclusivo as string === 'true' ? true : false;
    const caracteristicas = req.query.caracteristicas as string;
    const valor = parseInt(req.query.valor as string);
    let respuesta: ResponseType = { success: false, type: Action.Update, info: "", funkoPops: undefined };
    const funko = new Funko(id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas, valor);
    if(ManejadorJSON.modificarFunkoDB(funko, usuario)) {
      respuesta = { success: true, type: Action.Update, info: "Se modificó el funko de la colección del usuario.", funkoPops: undefined };
    } else {
      respuesta = { success: false, type: Action.Update, info: "Ocurrió un error.", funkoPops: undefined };
    }
    res.send(JSON.stringify(respuesta));
  });


/**
 * Acción por defecto
 */
app.use((_, res) => {
  res.send('<h1>404</h1>');
});

/**
 * Inicia el servidor
 */
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});