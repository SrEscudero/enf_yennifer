from PIL import Image

def convertir_a_webp(ruta_origen, ruta_destino, calidad=80):
    # Abrir la imagen original
    imagen = Image.open(ruta_origen)
    
    # Guardarla en formato WebP
    imagen.save(ruta_destino, 'webp', optimize=True, quality=calidad)
    print(f"✅ Imagen convertida con éxito: {ruta_destino}")

# Ejemplo de uso con tu imagen principal
convertir_a_webp('./images/yennifer.jpeg', './images/yennifer.webp')