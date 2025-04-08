# Run in Powershell

function Invoke-Scale-All-Fly-Apps-To-One {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipeline=$true)]
        $AppNameRaw
    )
    process {

        $AppName = $AppNameRaw.Trim()

        # List of forbidden app names
        $ForbiddenApps = @("wdcc-website-v4", "wdccxsesahackathon-com", "wdcc-uasc-api", "uabc-prod-db", "wdcc-uabc")

        # Exit early if $AppName is empty
        if (-not $AppName) {
            Write-Output " --- ❌ No AppName provided. Skipping... --- "
            return
        }

        # Check if AppName is in the forbidden list
        if ($ForbiddenApps -contains $AppName) {
            Write-Output " --- ⚠️  Skipping $AppName (Forbidden) --- "
            return
        }

        # SCALE
        Write-Output " --- Scaling $AppName to 1 --- "
        fly scale count 1 -a $AppName --auto-confirm
        fly scale vm shared-cpu-1x --vm-memory=256 -a $AppName
    }
}

# ⚠️ Warning: This script is semi-dangerous to run. Make sure you're on the right account (fly whoami) and have checked with Nate!
fly apps list --quiet | Invoke-Scale-All-Fly-Apps-To-One
# Invoke-Scale-All-Fly-Apps-To-One wdcc-website-v4-staging
