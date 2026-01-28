Write-Host "=== Интерактивный калькулятор PowerShell ==="
Write-Host "Поддерживаемые операции:"
Write-Host "+, -, *, /, ^ (степень), root (корень), sin, cos, tan, ln, log, mod"
Write-Host "Для выхода введите: exit"
Write-Host ""

while ($true) {
    $inputExpr = Read-Host "Введите выражение (например: 2 + 3, sin 30, 5 ^ 2, log 100)"
    
    if ($inputExpr -eq "exit") {
        Write-Host "Выход из калькулятора..."
        break
    }

    try {
        # Разделяем выражение по пробелам
        $parts = $inputExpr.Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)

        switch ($parts.Count) {
            2 {
                # Одноаргументные функции: sin, cos, tan, ln, log
                $op = $parts[0].ToLower()
                $a = [double]$parts[1]

                switch ($op) {
                    "sin" { $result = [math]::Sin([math]::PI * $a / 180) }
                    "cos" { $result = [math]::Cos([math]::PI * $a / 180) }
                    "tan" { $result = [math]::Tan([math]::PI * $a / 180) }
                    "ln"  { $result = [math]::Log($a) }
                    "log" { $result = [math]::Log10($a) }
                    default { throw "Неизвестная операция '$op'" }
                }
            }
            3 {
                # Двоичные операции: +, -, *, /, ^, root, mod
                $a = [double]$parts[0]
                $op = $parts[1]
                $b = [double]$parts[2]

                switch ($op) {
                    "+" { $result = $a + $b }
                    "-" { $result = $a - $b }
                    "*" { $result = $a * $b }
                    "/" { 
                        if ($b -eq 0) { throw "Деление на ноль!" }
                        $result = $a / $b 
                    }
                    "^" { $result = [math]::Pow($a, $b) }
                    "root" { $result = [math]::Pow($a, 1 / $b) }
                    "mod" { $result = $a % $b }
                    default { throw "Неизвестная операция '$op'" }
                }
            }
            default {
                throw "Некорректный формат ввода!"
            }
        }

        Write-Host "Результат: $result"
        Write-Host ""
    }
    catch {
        Write-Host "Ошибка: $($_.Exception.Message)"
        Write-Host ""
    }
}
