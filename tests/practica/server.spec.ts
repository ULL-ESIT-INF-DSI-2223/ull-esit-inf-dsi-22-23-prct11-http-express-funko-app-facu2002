import "mocha";
import { expect } from "chai";
import request from 'request';

describe('Servidor de la práctica', () => {
  it('Listar un funko con una petición http GET', (done) => {
    const URL = "http://localhost:3000/funkos?usuario=facundo";
    request({ method: 'GET', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.success).to.be.equal(true);
      expect(response.body.type).to.be.equal('List');
      expect(response.body.info).to.be.equal('Mostrando la lista de funkos.');
      expect(response.body.funkoPops.length).not.to.be.equal(0);
    });
    done();
  });

  it('Mostrar un funko con una petición http GET', (done) => {
    const URL = "http://localhost:3000/funkos?usuario=facundo&id=1";
    request({ method: 'GET', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.success).to.be.equal(true);
      expect(response.body.type).to.be.equal('Read');
      expect(response.body.info).to.be.equal('Mostrando el funko.');
      expect(response.body.funkoPops.length).to.be.equal(1);
    });
    done();
  });

  it('Añadir un funko con una petición http POST', (done) => {
    const URL = "http://localhost:3000/funkos?usuario=facundo&id=11&nombre=nuevo&descripcion=ahora&tipo=Pop&genero=Animación&franquicia=Hiperdino&numero=3&exclusivo=true&caracteristicas=ninguna&valor=30";
    request({ method: 'POST', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.success).to.be.equal(true);
      expect(response.body.type).to.be.equal('Add');
      expect(response.body.info).to.be.equal('Se añadió el funko a la colección del usuario.');
      expect(response.body.funkoPops).to.be.equal(undefined);
    });
    done();
  });

  it('Modificar un funko con una petición http PATCH', (done) => {
    const URL = "http://localhost:3000/funkos?usuario=facundo&id=11&nombre=nuevo&descripcion=ahora&tipo=Pop&genero=Animación&franquicia=Mercadona&numero=3&exclusivo=true&caracteristicas=ninguna&valor=30";
    request({ method: 'PATCH', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.success).to.be.equal(true);
      expect(response.body.type).to.be.equal('Update');
      expect(response.body.info).to.be.equal('Se modificó el funko de la colección del usuario.');
      expect(response.body.funkoPops).to.be.equal(undefined);
    });
    done();
  });


  it('Eliminar un funko con una petición http DELETE', (done) => {
    const URL = "http://localhost:3000/funkos?usuario=facundo&id=11";
    request({ method: 'DELETE', url: URL, json: true}, (error: Error, response) => {
      expect(response.body.success).to.be.equal(true);
      expect(response.body.type).to.be.equal('Remove');
      expect(response.body.info).to.be.equal('Se eliminó el funko de la colección del usuario.');
      expect(response.body.funkoPops).to.be.equal(undefined);
    });
    done();
  });
});