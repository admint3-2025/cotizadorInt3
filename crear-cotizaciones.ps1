# Script para crear 3 cotizaciones de prueba (plantillas 1/2/3)

Write-Host "\nObteniendo token..." -ForegroundColor Cyan
$loginBody = @{
    email = "admint3"
    password = "72286428joe"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    Write-Host "Token obtenido" -ForegroundColor Green
} catch {
    Write-Host "Error al conectar: $_" -ForegroundColor Red
    exit 1
}

# Verificar clientes
Write-Host "Verificando clientes..." -ForegroundColor Cyan
$clients = Invoke-RestMethod -Uri "http://localhost:3000/api/clients" -Method GET -Headers $headers

if ($clients.Count -eq 0) {
    Write-Host "Creando cliente de prueba..." -ForegroundColor Yellow
    $clientBody = @{
        name = "Juan Pérez García"
        company = "Tech Solutions SA de CV"
        email = "juan.perez@techsolutions.com.mx"
        phone = "5551234567"
        address = "Av. Revolución 1234, CDMX"
    } | ConvertTo-Json
    
    $newClient = Invoke-RestMethod -Uri "http://localhost:3000/api/clients" -Method POST -Headers $headers -Body $clientBody
    $clientId = $newClient.id
    Write-Host "Cliente creado con ID: $clientId" -ForegroundColor Green
} else {
    $clientId = $clients[0].id
    Write-Host "Usando cliente existente: $($clients[0].name) (ID: $clientId)" -ForegroundColor Green
}

# Verificar productos
Write-Host "Verificando productos..." -ForegroundColor Cyan
$products = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET -Headers $headers

if ($products.Count -eq 0) {
    Write-Host "Creando productos de prueba..." -ForegroundColor Yellow
    
    $product1 = @{
        code = "SOFT-001"
        name = "Licencia Microsoft Office 365"
        description = "Suite ofimática completa"
        specifications = "Incluye Word, Excel, PowerPoint, Outlook. Licencia anual para 1 usuario"
        unit_price = 2500.00
        category = "Software"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body $product1 | Out-Null
    
    $product2 = @{
        code = "HARD-002"
        name = "Laptop Dell Latitude 5420"
        description = "Laptop empresarial"
        specifications = "Intel Core i7-1185G7, 16GB RAM, SSD 512GB, Windows 11 Pro"
        unit_price = 25000.00
        category = "Hardware"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body $product2 | Out-Null
    
    $product3 = @{
        code = "SERV-003"
        name = "Soporte Técnico Premium"
        description = "Plan de soporte mensual"
        specifications = "Atención 24/7, respuesta en 2 horas, mantenimiento preventivo incluido"
        unit_price = 5000.00
        category = "Servicios"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body $product3 | Out-Null
    
    Write-Host "3 productos creados" -ForegroundColor Green
} else {
    Write-Host "$($products.Count) productos disponibles" -ForegroundColor Green
}

# Crear las 3 cotizaciones con diferentes plantillas
$templates = @(
    @{name="Minimalista"; value=1; color="Gray"},
    @{name="Profesional"; value=2; color="Cyan"},
    @{name="Moderno"; value=3; color="Magenta"}
)

foreach ($template in $templates) {
    Write-Host "\nCreando cotización con plantilla: $($template.name)" -ForegroundColor $template.color
    
    $quoteBody = @{
        client_id = $clientId
        client_name = "Juan Pérez García"
        client_company = "Tech Solutions SA de CV"
        client_email = "juan.perez@techsolutions.com.mx"
        client_phone = "5551234567"
        items = @(
            @{
                code = "SERV-003"
                description = "Servicio de consultoría"
                specs = "Una sola partida para validar plantilla"
                quantity = 1
                unit_price = 12449.12
            }
        )
        subtotal = 12449.12
        tax = [Math]::Round(12449.12 * 0.16, 2)
        total = [Math]::Round(12449.12 * 1.16, 2)
        validity_days = 30
        payment_terms = "50% anticipo, 50% contra entrega"
        delivery_time = "15 días hábiles"
        notes = "Prueba controlada: 1 solo item para validar páginas."
        template_type = $template.value
    } | ConvertTo-Json -Depth 10
    
    $quoteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/quotes" -Method POST -Headers $headers -Body $quoteBody
    Write-Host "   Cotización creada: $($quoteResponse.folio)" -ForegroundColor Green
    
    # Descargar PDF
    $filename = "TEST_$($template.name)_$($quoteResponse.folio).pdf"
    Invoke-RestMethod -Uri "http://localhost:3000/api/quotes/$($quoteResponse.id)/pdf" -Method GET -Headers $headers -OutFile $filename
    Write-Host "   PDF descargado: $filename" -ForegroundColor Green
}

Write-Host "\n\nProceso completado" -ForegroundColor Green
Write-Host "Verifica los 3 archivos PDF generados:" -ForegroundColor Yellow
Write-Host "   - TEST_Minimalista_*.pdf (diseño gris limpio)" -ForegroundColor Gray
Write-Host "   - TEST_Profesional_*.pdf (azul/verde corporativo, 2 páginas)" -ForegroundColor Cyan
Write-Host "   - TEST_Moderno_*.pdf (moderno elegante azul oscuro)" -ForegroundColor Magenta
Write-Host "\nCada PDF debe mostrar el logo de Integrational y diseño único\n" -ForegroundColor White
