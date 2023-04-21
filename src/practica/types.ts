import { Funko } from "./funko/funko.js";


// export type FunkoPop = {
//   id: number;
//   nombre: string;
//   descripcion: string;
//   tipo: TipoFunko;
//   genero: GeneroFunko;
//   franquicia: string;
//   numero: number;
//   exclusivo: boolean;
//   caracteristicas: string;
//   valor: number;
// }

export type ResponseType = {
  success: boolean;
  funkoPops?: Funko[];
}