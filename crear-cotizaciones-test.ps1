# Script para crear 3 cotizaciones de prueba

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  GENERADOR DE COTIZACIONES DE PRUEBA" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n[1/6] Obteniendo token..." -ForegroundColor Yellow
$loginBody = '{"username":"admint3","password":"72286428joe"}'

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    Write-Host "      Token obtenido exitosamente" -ForegroundColor Green
}
catch {
    Write-Host "      ERROR: No se pudo conectar al servidor" -ForegroundColor Red
    Write-Host "      Asegurate de que npm run dev este ejecutandose" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/6] Verificando clientes..." -ForegroundColor Yellow
$clients = Invoke-RestMethod -Uri "http://localhost:3000/api/clients" -Method GET -Headers $headers

if ($clients.Count -eq 0) {
    Write-Host "      Creando cliente de prueba..." -ForegroundColor Gray
    $clientBody = '{"name":"Juan Perez Garcia","company":"Tech Solutions SA de CV","email":"juan.perez@techsolutions.com.mx","phone":"5551234567","address":"Av. Revolucion 1234, CDMX"}'
    $newClient = Invoke-RestMethod -Uri "http://localhost:3000/api/clients" -Method POST -Headers $headers -Body $clientBody -ContentType "application/json"
    $clientId = $newClient.id
    Write-Host "      Cliente creado: ID $clientId" -ForegroundColor Green
}
else {
    $clientId = $clients[0].id
    Write-Host "      Cliente existente: $($clients[0].name) (ID: $clientId)" -ForegroundColor Green
}

Write-Host "`n[3/6] Verificando productos..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET -Headers $headers

if ($products.Count -lt 3) {
    Write-Host "      Creando productos de prueba..." -ForegroundColor Gray
    
    $p1 = '{"code":"SOFT-001","name":"Licencia Microsoft Office 365","description":"Suite ofimatica completa","specifications":"Incluye Word, Excel, PowerPoint, Outlook. Licencia anual para 1 usuario","unit_price":2500.00,"category":"Software"}'
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body $p1 -ContentType "application/json" | Out-Null
    
    $p2 = '{"code":"HARD-002","name":"Laptop Dell Latitude 5420","description":"Laptop empresarial","specifications":"Intel Core i7-1185G7, 16GB RAM, SSD 512GB, Windows 11 Pro","unit_price":25000.00,"category":"Hardware"}'
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body $p2 -ContentType "application/json" | Out-Null
    
    $p3 = '{"code":"SERV-003","name":"Soporte Tecnico Premium","description":"Plan de soporte mensual","specifications":"Atencion 24/7, respuesta en 2 horas, mantenimiento preventivo incluido","unit_price":5000.00,"category":"Servicios"}'
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body $p3 -ContentType "application/json" | Out-Null
    
    Write-Host "      3 productos creados" -ForegroundColor Green
}
else {
    Write-Host "      $($products.Count) productos disponibles" -ForegroundColor Green
}

# Plantillas
$templates = @(
    @{name="Minimalista"; value=1},
    @{name="Profesional"; value=2},
    @{name="Moderno"; value=3}
)

$counter = 4
foreach ($template in $templates) {
    Write-Host "`n[$counter/6] Creando cotizacion: $($template.name)..." -ForegroundColor Yellow
    $counter++
    
    $quoteJson = @"
{
    "client_id": $clientId,
    "client_name": "Juan Perez Garcia",
    "client_company": "Tech Solutions SA de CV",
    "client_email": "juan.perez@techsolutions.com.mx",
    "client_phone": "5551234567",
    "items": [
        {
            "code": "SOFT-001",
            "description": "Licencia Microsoft Office 365",
            "specs": "Suite completa - Licencia anual",
            "quantity": 5,
            "unit_price": 2500.00
        },
        {
            "code": "HARD-002",
            "description": "Laptop Dell Latitude 5420",
            "specs": "Intel i7, 16GB RAM, 512GB SSD, Win11 Pro",
            "quantity": 2,
            "unit_price": 25000.00
        },
        {
            "code": "SERV-003",
            "description": "Soporte Tecnico Premium",
            "specs": "Atencion 24/7, mantenimiento incluido",
            "quantity": 1,
            "unit_price": 5000.00
        }
    ],
    "subtotal": 67500.00,
    "tax": 10800.00,
    "total": 78300.00,
    "validity_days": 30,
    "payment_terms": "50% anticipo, 50% contra entrega",
    "delivery_time": "15 dias habiles",
    "notes": "Incluye instalacion y capacitacion basica. Garantia de 12 meses en hardware.",
    "template_type": $($template.value)
}
"@

    $quoteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/quotes" -Method POST -Headers $headers -Body $quoteJson -ContentType "application/json"
    Write-Host "      Cotizacion creada: $($quoteResponse.folio)" -ForegroundColor Green
    
    # Descargar PDF
    $filename = "TEST_$($template.name)_$($quoteResponse.folio).pdf"
    Invoke-RestMethod -Uri "http://localhost:3000/api/quotes/$($quoteResponse.id)/pdf" -Method GET -Headers $headers -OutFile $filename
    Write-Host "      PDF descargado: $filename" -ForegroundColor Green
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "  PROCESO COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`nArchivos generados:" -ForegroundColor Cyan
Get-ChildItem -Filter "TEST_*.pdf" | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}

Write-Host "`nVerifica que cada PDF tenga:" -ForegroundColor Yellow
Write-Host "  Logo de Integrational" -ForegroundColor Gray
Write-Host "  Diseno unico segun plantilla" -ForegroundColor Gray
Write-Host "  Colores distintivos" -ForegroundColor Gray
Write-Host ""
