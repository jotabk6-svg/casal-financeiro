param(
    [string]$msg = ""
)

$env:PATH += ";C:\Program Files\Git\cmd"

Set-Location $PSScriptRoot

if ($msg -eq "") {
    $data = Get-Date -Format "dd/MM/yyyy HH:mm"
    $msg = "update: $data"
}

Write-Host ""
Write-Host "  Publicando alteracoes..." -ForegroundColor Cyan
Write-Host ""

git add .
git commit -m $msg
git push

Write-Host ""
Write-Host "  Pronto! Vercel vai atualizar em ~2 minutos." -ForegroundColor Green
Write-Host "  https://casal-financeiro-beta.vercel.app" -ForegroundColor Gray
Write-Host ""
