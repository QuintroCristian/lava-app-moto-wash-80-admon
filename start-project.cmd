:: ====================================================
:: Script de inicio de proyecto LavApp
:: Autor: Equipo LavApp
:: Versión: 1.0
:: Descripción: Script seguro para iniciar servicios de
:: desarrollo de LavApp (Frontend y Backend)
:: ====================================================
@echo off
:: Asegurar que estamos usando CRLF para Windows
set "GITATTRIBUTES=.gitattributes"
if not exist "%GITATTRIBUTES%" (
    echo # Auto detect text files and perform LF normalization> "%GITATTRIBUTES%"
    echo * text=auto>> "%GITATTRIBUTES%"
    echo *.cmd text eol=crlf>> "%GITATTRIBUTES%"
    echo *.bat text eol=crlf>> "%GITATTRIBUTES%"
)
:: Configurar codificación UTF-8
chcp 65001 > nul
setlocal EnableDelayedExpansion
title LavApp - Script de inicio

:: Saltar a la ejecución principal, evitando la definición de funciones
goto :main

:: ====================================================
:: Definición de funciones
:: ====================================================
:loading
set /a counter=0
set "spinner=\|/-"
:spin
set /a counter+=1
if !counter! gtr %~2 goto :eof
for /l %%i in (0,1,3) do (
    cls
    echo %~1
    echo !spinner:~%%i,1!
    timeout /t 0 /nobreak >nul
)
goto spin

:: ====================================================
:: Inicio del script principal
:: ====================================================
:main
echo Verificando requisitos previos...

:: Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python no esta instalado. Por favor, instale Python y vuelva a intentar.
    pause
    exit /b 1
)

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js no esta instalado. Por favor, instale Node.js y vuelva a intentar.
    pause
    exit /b 1
)

echo Requisitos previos verificados correctamente.

echo Configurando el proyecto
call :loading "Preparando entorno..." 12

:: Configurar el backend
cd backend


:: Iniciar servicios
echo Iniciando servicios...
call :loading "Iniciando backend..." 10

:: Iniciar backend en una nueva ventana
start cmd /k "cd ../backend && python main.py"

call :loading "Esperando backend..." 8
timeout /t 5 >nul

call :loading "Iniciando frontend..." 10

:: Iniciar frontend en una nueva ventana
start cmd /k "cd ../frontend && npm run dev"

call :loading "Esperando frontend..." 8
timeout /t 5 >nul

:: Abrir el navegador
start  http://localhost:5173/

echo Servicios iniciados correctamente.
echo Backend corriendo en http://192.168.0.110:8001
echo Frontend corriendo en http://192.168.0.110:5173

pause