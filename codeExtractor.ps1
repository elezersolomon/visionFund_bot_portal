$maxLines = 800
$currentFile = 1
$currentLines = 0
$currentFileContent = @()

# Define the output folder and ensure it exists
$outputFolder = Join-Path (Get-Location).Path "extractedCode"

# Create or clean the 'extractedCode' folder
if (Test-Path $outputFolder) {
    # Remove existing files in the folder
    Get-ChildItem -Path $outputFolder | Remove-Item -Force
} else {
    # Create the folder if it doesn't exist
    New-Item -Path $outputFolder -ItemType Directory
}

function Write-FileContent {
    param (
        [string]$fileName,
        [array]$content
    )
    Write-Output "Writing to $fileName with $($content.Count) lines."  # Debug print
    Set-Content -Path $fileName -Value $content
}

# Get the directory where the script is executed
$basePath = (Get-Location).Path

# Traverse the current directory and process each file
Get-ChildItem -Recurse -File -Path $basePath | ForEach-Object {
    Write-Output "Processing file: $($_.FullName)"  # Debug print

    $relativePath = $_.FullName.Substring($_.FullName.IndexOf($basePath) + $basePath.Length).TrimStart("\")
    $fileContent = Get-Content $_.FullName

    # Start a new module with the "File: <relativePath>" line
    $moduleLines = @("File: $relativePath")
    $moduleLines += $fileContent

    # Check if adding the module exceeds the maximum lines
    if ($currentLines + $moduleLines.Count -gt $maxLines) {
        # Write the current file content to disk with the correct naming convention
        $outputFilePath = Join-Path $outputFolder "extractedCodePart$currentFile.txt"
        Write-FileContent -fileName $outputFilePath -content $currentFileContent

        # Start a new file
        $currentFile++
        $currentLines = 0
        $currentFileContent = @()
    }

    # Add the module lines to the current file and update line count
    $currentFileContent += $moduleLines
    $currentLines += $moduleLines.Count
}

# Write the remaining content to the last file
if ($currentFileContent.Count -gt 0) {
    $outputFilePath = Join-Path $outputFolder "extractedCodePart$currentFile.txt"
    Write-FileContent -fileName $outputFilePath -content $currentFileContent
}
