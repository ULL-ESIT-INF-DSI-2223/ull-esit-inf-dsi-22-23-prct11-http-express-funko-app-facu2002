import express from 'express';
import {spawn} from 'child_process';

//Implemente un servidor Express en el que se exponga un punto de acceso JSON en la ruta '/execmd'. 
//Al mismo tiempo, haga que el servidor devuelva, por defecto, algo similar a '<h1>404</h1>' en el caso 
//de que se intente acceder a una ruta no válida.

const app = express();


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


// Acción por defecto
app.use((_, res) => {
  res.send('<h1>404</h1>');
});


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});