@echo off
setlocal

echo.
echo  ============================================================
echo    AquaCoEmployer - Recompilar Backend (si hubo cambios)
echo  ============================================================
echo.

set MAVEN="C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.4\plugins\maven\lib\maven3\bin\mvn.cmd"

cd /d "%~dp0backend"

echo Copiando frontend al static de Spring Boot...
xcopy /E /Y /I "..\frontend\*" "src\main\resources\static\"

echo.
echo Compilando y empaquetando el backend...
call %MAVEN% clean package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo  BUILD EXITOSO. Iniciando servidor...
    echo  Accede a: http://localhost:8080
    echo.
    java -jar target\demo-0.0.1-SNAPSHOT.jar
) else (
    echo.
    echo  ERROR EN BUILD. Revisa los errores arriba.
)

pause
