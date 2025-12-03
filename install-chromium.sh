#!/bin/bash

# Instalar dependencias de Chromium para Puppeteer
apt-get update
apt-get install -y chromium chromium-driver

# Configurar Puppeteer para usar el Chromium del sistema
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
