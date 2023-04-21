import { Funko } from "./funko/funko.js";

export enum Action { 
  "Add" = "Add",
  "Remove" = "Remove",
  "List" = "List",
  "Update" = "Update",
  "Read" = "Read"
}

export type ResponseType = {
  success: boolean;
  type: Action,
  info: string,
  funkoPops?: Funko[];
}