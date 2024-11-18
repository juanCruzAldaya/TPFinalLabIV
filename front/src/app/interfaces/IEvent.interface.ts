export interface IEvento {
    id: number;
    calendario_id: number;
    fecha: string;
    hora_inicio: string
    hora_fin: string;
    estado: string;
  
  }


/*
class EventoBase(BaseModel):
calendario_id: int
fecha: date
hora_inicio: time
hora_fin: time
estado: Optional[str] = "disponible" */