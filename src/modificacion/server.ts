import express from 'express';
import {spawn} from 'child_process';

//Implemente un servidor Express en el que se exponga un punto de acceso JSON en la ruta '/execmd'. 
//Al mismo tiempo, haga que el servidor devuelva, por defecto, algo similar a '<h1>404</h1>' en el caso 
//de que se intente acceder a una ruta no válida.


/**
 * Servidor Express
 */
const app = express();

/**
 * Función principal en la que se debe ejecutar el comando solicitado en la petición.
 */
app.get('/execmd', (req, res) => {
  const cmd = req.query.cmd as string;
  let args;
  let ejecucion;
  if(req.query.args !== undefined) {
    args = req.query.args as string;
    ejecucion = spawn(cmd, args.split(' '));
  } else {
    ejecucion = spawn(cmd);
  }


  let salida = '';
  let outputError = '';
  ejecucion.stdout.on('data', (data) => {
    salida += data;
  });

  ejecucion.stderr.on('data', (err) => {
    outputError += err;
  });

  ejecucion.on('error', (err) => {
    outputError += err;
  });

  ejecucion.on('close', () => {
    if(outputError.length === 0) {
      res.send(JSON.stringify({ output: salida }));
    } else {
      res.send(JSON.stringify({ error: outputError }));
    }
  });
});


/**
 * Acción por defecto
 */
app.use((_, res) => {
  res.send('<h1>404</h1>');
});

/**
 * Inicio del servidor
 */
app.listen(3001, () => {
  console.log('Server is up on port 3001');
});