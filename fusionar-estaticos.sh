#!/usr/bin/env bash

# Compilar React y mover los archivos generados a la carpeta estática de Spring Boot
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$BASE_DIR/formulario-entrevistas"
STATIC_DIR="$BASE_DIR/backend/src/main/resources/static"

echo "-> Compilando el frontend de React..."
cd "$FRONTEND_DIR" || exit 1
npm run build || exit 1

echo "-> Copiando archivos compilados a Spring Boot ($STATIC_DIR)..."
mkdir -p "$STATIC_DIR"
rm -rf "$STATIC_DIR"/*
cp -r "$FRONTEND_DIR/dist"/* "$STATIC_DIR/"

echo "=========================================================="
echo "  [OK] Frontend integrado dentro de Spring Boot con éxito."
echo "  Ahora al iniciar Spring Boot, todo estará disponible en:"
echo "  http://localhost:8080"
echo "=========================================================="
