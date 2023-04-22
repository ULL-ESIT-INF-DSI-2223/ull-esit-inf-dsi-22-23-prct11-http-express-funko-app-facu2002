import { Funko } from "./funko/funko.js";

/**
 * Enumerado con las acciones que se pueden realizar con los Funkos
 */
export enum Action { 
  "Add" = "Add",
  "Remove" = "Remove",
  "List" = "List",
  "Update" = "Update",
  "Read" = "Read"
}


/**
 * Enumerado con el tipo de mensaje response que se pueden enviar
 */ 
export type ResponseType = {
  success: boolean;
  type: Action,
  info: string,
  funkoPops?: Funko[];
}