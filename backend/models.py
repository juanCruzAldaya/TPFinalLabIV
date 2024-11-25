
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time

from decimal import Decimal


class Usuario(BaseModel):
    id: Optional[int]
    email: EmailStr
    password: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    contacto: Optional[str] = None
    ciudad: Optional[str] = None
    nacimiento: Optional[date] = None
    calificacion_promedio: Optional[Decimal] = None


class Categoria(BaseModel):
    id: Optional[int]
    nombre: str

class SubCategoria(BaseModel):
    nombre: str
    categoria_id: int

class Servicio(BaseModel):
    id: Optional[int]
    profesionalId: Optional[int]
    description: Optional[str]
    mainCategory: int
    secondaryCategory: int
    state: Optional[str]
    department: Optional[str]
    locality: Optional[str]

class Resena(BaseModel):
    id: Optional[int]
    servicio_id: int
    cliente_id: int
    calificacion: int = Field(..., ge=1, le=5)
    comentario: Optional[str]
    fecha: Optional[date] = None


class EventoBase(BaseModel):
    id: Optional[int] = None
    calendario_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    estado: Optional[str] = "disponible"


class CalendarioBase(BaseModel):
    usuario_id: Optional[int] = None
    anio: Optional[int] = None
    mes: Optional[int] = None
    eventos: Optional[List[EventoBase]] = None

class EventoIDUpdate(BaseModel):
    evento_id: int

class Calendario(BaseModel):
    id: Optional[int]
    profesional_id: Optional[int]
    anio: Optional[int]
    mes: Optional[int]


class Contratacion(BaseModel):
    id: int
    cliente_id: int
    servicio_id: int
    fecha_contratacion: str
    hora_contratacion: str 
    calendario_id: int
    evento_id: Optional[int] = None
    contacto: str  
    domicilio: str  
    estado: str  
    comentarios: str



class ContractStatusUpdate(BaseModel):
    id: int
    estado: str





class MetodoDePago(BaseModel):
    id: Optional[int]
    cliente_id: int
    tipo: str
    detalles: str

class Direccion(BaseModel):
    id: Optional[int]
    cliente_id: int
    direccion: str
    ciudad: str
    codigo_postal: str



class EventoCreate(EventoBase):
    pass

class EventoUpdate(BaseModel):
    fecha: Optional[date]
    hora_inicio: Optional[time]
    hora_fin: Optional[time]
    estado: Optional[str]



class DeleteResponse(BaseModel):
    message: str

class EventIdResponser(BaseModel):
    evento_id: int

class EventoResponse(EventoBase):
    id: int

    class Config:
        orm_mode = True



class StatusUpdate(BaseModel):
    estado: str



class CalendarioCreate(CalendarioBase):
    pass

class CalendarioResponse(CalendarioBase):
    id: int
    eventos: List[EventoResponse] = []

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    userId: int
    email: str
    password: str

