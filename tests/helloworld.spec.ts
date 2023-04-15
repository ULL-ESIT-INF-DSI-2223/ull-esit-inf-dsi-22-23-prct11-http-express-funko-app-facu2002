import 'mocha';
import { expect } from 'chai';
import { helloWorld } from '../src/helloworld';

describe('Función helloworld', () => {
  it('Debe devolver una cadena de texto', () => {
    expect(helloWorld()).to.be.equal("Hello World!");
  });
});