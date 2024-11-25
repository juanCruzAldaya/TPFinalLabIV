from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models import Categoria, SubCategoria
import mysql.connector

categories_router = APIRouter()

@categories_router.get("/categorias")
def get_categorias():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categorias")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@categories_router.get("/categoria/{categoria_id}")
def get_categoria(categoria_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM categorias WHERE id = %s", (categoria_id,))
        results = cursor.fetchone()
        
        if not results:
            raise HTTPException(status_code=404, detail="Category not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()

@categories_router.post("/categorias")
def add_categoria(categoria: Categoria):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO categorias (nombre) VALUES (%s)", (categoria.nombre,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Categoria added successfully"}

@categories_router.get("/subcategorias/{categoria_id}")
def get_subcategoria(categoria_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM subcategorias WHERE categoria_id = %s", (categoria_id,))
        results = cursor.fetchone()
        
        if not results:
            raise HTTPException(status_code=404, detail="Subcategories not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()

@categories_router.get("/subcategoria/{id}")
def get_subcategoria(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM subcategorias WHERE id = %s", (id,))
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()

@categories_router.get("/subcategoriasById/{id}")
def get_subcategoria(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM subcategorias WHERE categoria_id = %s", (id,))
        results = cursor.fetchall()

        if not results:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()

@categories_router.get("/subcategorias")
def get_subcategorias():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM subcategorias")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@categories_router.post("/subcategorias")
def add_subcategoria(subcategoria: SubCategoria):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO subcategorias (nombre, categoria_id) VALUES (%s, %s)", (subcategoria.nombre, subcategoria.categoria_id))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "SubCategoria added successfully"}