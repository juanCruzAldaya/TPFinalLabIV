from fastApi import includer


# Ejecutar la aplicación usando Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(includer(), host="127.0.0.1", port=8000)