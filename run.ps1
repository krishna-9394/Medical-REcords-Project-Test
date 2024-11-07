# PowerShell script to update contract address and ABI

# Contract file path
$contractFile = "build\contracts\HealthCare.json"
$envFile = ".env"

# Check if contract file exists
if (!(Test-Path $contractFile)) {
    Write-Host "Error: Contract file not found at $contractFile" -ForegroundColor Red
    exit 1
}

try {
    # Read and parse the JSON file
    $jsonContent = Get-Content $contractFile -Raw | ConvertFrom-Json
    
    # Extract the contract address
    $contractAddress = $jsonContent.networks.'5777'.address
    
    if (!$contractAddress) {
        Write-Host "Error: Could not find contract address in the JSON file" -ForegroundColor Red
        exit 1
    }
    
    # Extract and format the ABI
    $abi = $jsonContent.abi | ConvertTo-Json -Compress
    # Escape quotes for .env file
    $abi = $abi.Replace('"', '\"')
    
    # Prepare the lines to be written
    $addressLine = "CONTRACT_ADDRESS=$contractAddress"
    $abiLine = "CONTRACT_ABI=$abi"
    
    # Check if .env file exists
    if (Test-Path $envFile) {
        # Read all lines from the file
        $envContent = Get-Content $envFile
        
        # Create new content
        $newContent = @()
        $addressFound = $false
        $abiFound = $false
        
        # Process existing lines
        foreach ($line in $envContent) {
            if ($line -match '^CONTRACT_ADDRESS=') {
                $newContent += $addressLine
                $addressFound = $true
            }
            elseif ($line -match '^CONTRACT_ABI=') {
                $newContent += $abiLine
                $abiFound = $true
            }
            else {
                $newContent += $line
            }
        }
        
        # Add new lines if they weren't found
        if (!$addressFound) {
            $newContent += $addressLine
        }
        if (!$abiFound) {
            $newContent += $abiLine
        }
        
        # Write back to file
        $newContent | Set-Content $envFile -Encoding UTF8
    } else {
        # Create new .env file
        @($addressLine, $abiLine) | Set-Content $envFile -Encoding UTF8
    }
    
    Write-Host "Successfully updated CONTRACT_ADDRESS and CONTRACT_ABI in $envFile" -ForegroundColor Green
    Write-Host "Contract address: $contractAddress" -ForegroundColor Cyan
    Write-Host "ABI has been stored in the .env file" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: An error occurred while processing the files" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}