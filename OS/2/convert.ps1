Write-Host "=== Конвертер температуры ==="
Write-Host "Введите значение с единицей измерения:"
Write-Host "Например: 100C, 100F, 100K, или просто 100 (по умолчанию — °C)"
Write-Host ""

# Запрос ввода
$tempInput = Read-Host "Введите температуру"

# Определяем единицу измерения
if ($tempInput -match '^\s*([+-]?\d+(\.\d+)?)\s*([KkCcFf])?\s*$') {
    $value = [double]$matches[1]
    $unit = $matches[3].ToUpper()

    if (-not $unit) {
        $unit = "C"  # По умолчанию — Цельсий
    }

    switch ($unit) {
        "C" {
            $c = $value
            $k = $c + 273.15
            $f = ($c * 9 / 5) + 32
        }
        "F" {
            $f = $value
            $c = ($f - 32) * 5 / 9
            $k = $c + 273.15
        }
        "K" {
            $k = $value
            $c = $k - 273.15
            $f = ($c * 9 / 5) + 32
        }
        default {
            Write-Host "Ошибка: неизвестная единица измерения '$unit'" -ForegroundColor Red
            exit
        }
    }

    Write-Host ""
    Write-Host "Результаты преобразования:" -ForegroundColor Cyan
    Write-Host ("{0,10} °C" -f [math]::Round($c, 2))
    Write-Host ("{0,10} K" -f [math]::Round($k, 2))
    Write-Host ("{0,10} °F" -f [math]::Round($f, 2))
}
else {
    Write-Host "Ошибка: введите корректное значение, например 100C, 273K или 32F." -ForegroundColor Red
}
