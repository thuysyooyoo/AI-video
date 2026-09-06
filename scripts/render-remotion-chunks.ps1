param(
  [Parameter(Mandatory = $true)][string]$Props,
  [Parameter(Mandatory = $true)][string]$Output,
  [int]$TotalFrames = 3455,
  [int]$ChunkFrames = 300,
  [int]$Concurrency = 4
)

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$outDir = Split-Path -Parent $Output
$chunkDir = Join-Path $outDir "chunks"
New-Item -ItemType Directory -Force $chunkDir | Out-Null
$log = Join-Path $outDir "chunk-render.log"
"chunk render start $(Get-Date -Format s)" | Set-Content $log

$chunks = @()
for ($start = 0; $start -lt $TotalFrames; $start += $ChunkFrames) {
  $end = [Math]::Min($start + $ChunkFrames - 1, $TotalFrames - 1)
  $chunk = Join-Path $chunkDir ("chunk_{0:D4}_{1:D4}.mp4" -f $start, $end)
  $chunks += $chunk
  if (Test-Path $chunk) {
    "skip $start-$end $chunk" | Add-Content $log
    Write-Host "skip $start-$end $chunk"
    continue
  }
  "render $start-$end $chunk" | Add-Content $log
  Write-Host "Rendering frames $start-$end to $chunk..."
  cmd.exe /c ".\node_modules\.bin\remotion.cmd render Reel `"$chunk`" `"--props=$Props`" `"--frames=$start-$end`" `"--concurrency=$Concurrency`" --log=error"
  if ($LASTEXITCODE -ne 0) {
    throw "remotion failed for frames $start-$end"
  }
}

$list = Join-Path $chunkDir "concat.txt"
$chunks | ForEach-Object { "file '$([System.IO.Path]::GetFileName($_))'" } | Set-Content $list -Encoding ASCII
if (Test-Path $Output) {
  Remove-Item -LiteralPath $Output -Force
}
"concat -> $Output" | Add-Content $log
& ffmpeg -y -f concat -safe 0 -i $list -c copy $Output 2>&1 | Add-Content $log
if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg concat failed"
}
"done $(Get-Date -Format s)" | Add-Content $log
