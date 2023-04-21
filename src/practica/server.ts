import express from 'express';
import { ManejadorJSON } from './funko/manejadorJSON.js';
import { ResponseType } from './types.js';
import { GeneroFunko, TipoFunko } from "./funko/enumerados.js";
import { Funko } from './funko/funko.js';

const app = express();


app.route('/funkos')
  .get((req, res) => {
    const id = req.query.id as string;
    if(id !== undefined) {
      const usuario = req.query.usuario as string;
      let respuesta: ResponseType = { success: false, funkoPops: undefined };
      if(ManejadorJSON.mostrarFunkoDB(parseInt(id), usuario).length === 0) {
        respuesta = { success: false, funkoPops: undefined };
      } else {
        const funko = ManejadorJSON.mostrarFunkoDB(parseInt(id), usuario);
        respuesta = { success: true, funkoPops: funko };
      }
      res.send(JSON.stringify(respuesta));
    } else if(id === undefined) {
        const usuario = req.query.usuario as string;
        let respuesta: ResponseType = { success: false, funkoPops: undefined };
        if(ManejadorJSON.listarFunkoDB(usuario).length === 0) {
          respuesta = { success: false, funkoPops: undefined };
        } else {
          const funkoVector = ManejadorJSON.listarFunkoDB(usuario);
          respuesta = { success: true, funkoPops: funkoVector };
        }
        res.send(JSON.stringify(respuesta));
      } else {
        res.send(JSON.stringify({ success: false, funkoPops: undefined }));
    }
  })
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
    let respuesta: ResponseType = { success: false, funkoPops: undefined };
    const funko = new Funko(id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas, valor);
    if(ManejadorJSON.agregarFunkoDB(funko, usuario)) {
      respuesta = { success: true, funkoPops: undefined };
    } else {
      respuesta = { success: false, funkoPops: undefined };
    }
    res.send(JSON.stringify(respuesta));
  })
  .delete((req, res) => {
    const usuario = req.query.usuario as string;
    const id = req.query.id as string;
    let respuesta: ResponseType = { success: false, funkoPops: undefined };
    if(ManejadorJSON.eliminarFunkoDB(parseInt(id), usuario)) {
      respuesta = { success: true, funkoPops: undefined };
    } else {
      respuesta = { success: false, funkoPops: undefined };
    }
    res.send(JSON.stringify(respuesta));
  })
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
    let respuesta: ResponseType = { success: false, funkoPops: undefined };
    const funko = new Funko(id, nombre, descripcion, tipo, genero, franquicia, numero, exclusivo, caracteristicas, valor);
    if(ManejadorJSON.modificarFunkoDB(funko, usuario)) {
      respuesta = { success: true, funkoPops: undefined };
    } else {
      respuesta = { success: false, funkoPops: undefined };
    }
    res.send(JSON.stringify(respuesta));
  });


// Acción por defecto
app.use((_, res) => {
  res.send('<h1>404</h1>');
});


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});