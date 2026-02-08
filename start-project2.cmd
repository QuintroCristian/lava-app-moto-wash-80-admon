:: ====================================================
:: Script de inicio de proyecto LavApp
:: Autor: Equipo LavApp
:: Versión: 1.0
:: Descripción: Script seguro para iniciar servicios de
:: desarrollo de LavApp (Frontend y Backend)
:: ====================================================
@echo off
:: Configuración inicial
title LavApp - Script de inicio
chcp 65001 > nul
setlocal EnableDelayedExpansion

:: Verificar requisitos previos
echo Verificando requisitos previos...

:: Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python no está instalado. Por favor, instale Python y vuelva a intentar.
    pause
    exit /b 1
)

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js no está instalado. Por favor, instale Node.js y vuelva a intentar.
    pause
    exit /b 1
)

echo Requisitos previos verificados correctamente.

:: Iniciar Backend en segundo plano y ocultar ventana
echo Iniciando backend...
start /B "" python backend/main.py >nul 2>&1

:: Esperar para asegurar que el backend está activo
timeout /t 5 >nul

:: Iniciar Frontend en segundo plano y ocultar ventana
echo Iniciando frontend...
start /B "" cmd /c "cd frontend && npm run dev >nul 2>&1"

:: Abrir el navegador con la dirección del frontend
start http://localhost:5173/

echo Servicios iniciados correctamente.
echo APP corriendo en http://localhost:5173/login
echo **********************************************
echo *           NO CIERRE ESTA VENTANA           *
echo **********************************************