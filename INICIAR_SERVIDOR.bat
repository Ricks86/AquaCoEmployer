@echo off
setlocal

echo.
echo  ============================================================
echo    AquaCoEmployer - EvalPsico Laboral - Spring Boot Backend
echo  ============================================================
echo.
echo  Iniciando el servidor backend + frontend en http://localhost:8080
echo.

cd /d "%~dp0backend"

java -jar target\demo-0.0.1-SNAPSHOT.jar

echo.
echo  El servidor se ha detenido.
pause
