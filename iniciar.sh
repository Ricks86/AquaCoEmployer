#!/usr/bin/env bash

# Obtener la ruta base del proyecto
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/formulario-entrevistas"

if [ -d "$HOME/.jdks/temurin-21.0.11" ]; then
    export JAVA_HOME="$HOME/.jdks/temurin-21.0.11"
else
    export JAVA_HOME=/usr/lib/jvm/java-25-openjdk
fi
export PATH="$JAVA_HOME/bin:$PATH"

echo "=========================================================="
echo "  Iniciando Proyecto Completo (Backend + Frontend)"
echo "=========================================================="

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "Deteniendo servicios..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    # Asegurar liberación de puertos
    fuser -k 8080/tcp 2>/dev/null
    fuser -k 5173/tcp 2>/dev/null
    echo "Servicios detenidos correctamente."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Iniciar Backend (Spring Boot)
echo "-> Iniciando Backend (Spring Boot en http://localhost:8080)..."
cd "$BACKEND_DIR" || exit 1
/home/duckyrichii/.m2/wrapper/dists/apache-maven-3.9.14-bin/1cb7fhup6b5n3bed6kckbrnspv/apache-maven-3.9.14/bin/mvn spring-boot:run > "$BASE_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

# 2. Iniciar Frontend (Vite React)
echo "-> Iniciando Frontend (React Vite en http://localhost:5173)..."
cd "$FRONTEND_DIR" || exit 1
npm run dev &
FRONTEND_PID=$!

echo "=========================================================="
echo "  [OK] Backend corriendo en:   http://localhost:8080"
echo "  [OK] Frontend corriendo en:  http://localhost:5173"
echo "  [LOG] Logs del backend en:   $BASE_DIR/backend.log"
echo "=========================================================="
echo "Presiona Ctrl + C en cualquier momento para detener ambos."

# Esperar 3 segundos e intentar abrir el navegador automáticamente
(sleep 3 && xdg-open http://localhost:5173 2>/dev/null) &

# Esperar a que terminen los procesos
wait $FRONTEND_PID $BACKEND_PID
