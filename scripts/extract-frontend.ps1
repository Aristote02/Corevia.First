param(
    [string]$TranscriptPath = "C:\Users\User\.cursor\projects\c-Corevia-First\agent-transcripts\8bdc85d7-b5f0-447c-9970-a2de9835163a\8bdc85d7-b5f0-447c-9970-a2de9835163a.jsonl",
    [string]$OutRoot = "C:\Corevia.First\src\frontend\Corevia.First.Web"
)

$line = Get-Content $TranscriptPath | Select-Object -Index 119
$obj = $line | ConvertFrom-Json
$text = $obj.message.content[0].text
$start = $text.IndexOf("THE FRONTEND STRUCTURE AND CODE")
$content = $text.Substring($start)

$fileHeaderRegex = [regex]'(?m)^(\s*)- ([^\r\n]+)$'
$matches = $fileHeaderRegex.Matches($content)

function Test-IsFile([string]$name) {
    $clean = ($name -replace '\s*\(.*$','').Trim()
    if ($clean -match '\.(tsx?|json|css|js|svg|html|toml|rc|ignore|md|lock)$') { return $true }
    if ($clean -in @('.prettierrc', '.prettierignore', 'bun.lock')) { return $true }
    return $false
}

function Get-CleanName([string]$name) {
    ($name -replace '\s*\(.*$','').Trim()
}

$stack = @()
$written = @()

for ($i = 0; $i -lt $matches.Count; $i++) {
    $m = $matches[$i]
    $indent = $m.Groups[1].Value.Length
    $rawName = $m.Groups[2].Value
    $name = Get-CleanName $rawName

    while ($stack.Count -gt 0 -and $stack[-1].Indent -ge $indent) {
        $stack = $stack[0..($stack.Count - 2)]
    }

    if (-not (Test-IsFile $rawName)) {
        $stack += [pscustomobject]@{ Indent = $indent; Name = $name }
        continue
    }

    $relParts = @($stack | ForEach-Object { $_.Name }) + @($name)
    $relPath = ($relParts -join '/').Replace('\', '/')

    # Root-level config files (not under src/)
    if ($stack.Count -eq 0 -or ($stack.Count -eq 1 -and $stack[0].Name -eq 'src' -and $name -match '^(package|tsconfig|vite|eslint|components|bun|\.prettier)')) {
        if ($stack.Count -eq 1 -and $stack[0].Name -eq 'src') {
            # files like styles.css, router.tsx live under src
        } elseif ($stack.Count -eq 0) {
            # root config
        }
    }

    if ($name -eq 'gitignore') { $relPath = '.gitignore' }
    if ($name.StartsWith('.')) {
        $relPath = $name
    } elseif ($stack.Count -gt 0 -and $stack[0].Name -eq 'src') {
        $relPath = ($relParts -join '/')
    } elseif ($stack.Count -eq 0) {
        $relPath = $name
    }

    $contentStart = $m.Index + $m.Length
    if ($contentStart -lt $content.Length -and $content[$contentStart] -eq "`r") { $contentStart++ }
    if ($contentStart -lt $content.Length -and $content[$contentStart] -eq "`n") { $contentStart++ }

    $contentEnd = $content.Length
    if ($i + 1 -lt $matches.Count) {
        $contentEnd = $matches[$i + 1].Index
    }

    $fileContent = $content.Substring($contentStart, $contentEnd - $contentStart).TrimEnd()

    $outPath = Join-Path $OutRoot ($relPath -replace '/', [IO.Path]::DirectorySeparatorChar)
    $outDir = Split-Path $outPath -Parent
    if ($outDir -and -not (Test-Path $outDir)) {
        New-Item -ItemType Directory -Path $outDir -Force | Out-Null
    }

    [System.IO.File]::WriteAllText($outPath, $fileContent, [System.Text.UTF8Encoding]::new($false))
    $written += $relPath
}

Write-Host "Wrote $($written.Count) files to $OutRoot"
$written | ForEach-Object { Write-Host "  $_" }
