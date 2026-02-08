export interface User {
  id?: string;
  nombre: string;
  apellido: string;
  usuario: string;
  rol: string;
}

export interface UserRegister extends User {
  clave?: string;
}
