# Reglas Globales de Autonomía y Flujo

1. **Autonomía total y ejecución directa:**
   - NUNCA solicites confirmación manual para editar archivos, compilar o ejecutar comandos habituales.
   - Aplica los cambios directamente sin pausar el flujo.
   - Si se requiere una prueba o verificación de compilación (`npm run build`), ejecútala inmediatamente de forma autónoma.

2. **Gestión de Git:**
   - Siempre que se finalice un bloque de trabajo solicitado por el usuario, empuja automáticamente los cambios a la rama activa (`alvaro01`).

3. **Arquitectura y Canonicidad del Proyecto:**
   - El código canónico reside en `src/`.
   - Tras realizar cambios en la aplicación, sincroniza hacia `frontend/` mediante `npm run sync:frontend` para garantizar compatibilidad con los despliegues de Docker y DigitalOcean.
