import "mocha";
import { expect } from "chai";
import request from 'request';

describe('Servidor de la modificación', () => {
  it('Comando que si existe sin argumentos', (done) => {
    const URL = "http://localhost:3001/execmd?cmd=ls";
    request({ method: 'GET', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.error).to.be.equal(undefined);
      done();
    });
  });
  it('Comando que si existe con argumentos', (done) => {
    const URL = "http://localhost:3001/execmd?cmd=ls&args=-l";
    request({ method: 'GET', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.error).to.be.equal(undefined);
      done();
    });
  });
  it('Comando que no existe', (done) => {
    const URL = "http://localhost:3001/execmd?cmd=ññ";
    request({ method: 'GET', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.error).to.be.equal("Error: spawn ññ ENOENT");
      done();
    });
  });
  it('Argumentos que no existen', (done) => {
    const URL = "http://localhost:3001/execmd?cmd=ls&args=-w";
    request({ method: 'GET', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.error).to.be.equal("ls: option requires an argument -- 'w'\nTry 'ls --help' for more information.\n");
      done();
    });
  });
});
