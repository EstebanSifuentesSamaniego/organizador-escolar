export type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  fechaDeEntrega: Date;
  imagenes: string[]; // URLs alojadas en Firebase Storage
};
