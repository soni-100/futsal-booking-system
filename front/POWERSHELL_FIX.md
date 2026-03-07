# PowerShell Execution Policy Fix

If you're getting an error about PowerShell execution policy blocking npm, here are several solutions:

## Solution 1: Use Command Prompt (CMD) instead

Instead of PowerShell, use Command Prompt (CMD):
1. Open Command Prompt (cmd.exe)
2. Navigate to the front directory: `cd front`
3. Run npm commands normally: `npm install`, `npm run dev`

## Solution 2: Bypass Execution Policy for Current Session

Run this command in PowerShell (doesn't require admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Then run your npm commands normally.

## Solution 3: Run npm via CMD from PowerShell

You can run npm commands through cmd from PowerShell:
```powershell
cd front
cmd /c "npm install"
cmd /c "npm run dev"
```

## Solution 4: Change Execution Policy Permanently (Requires Admin)

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This allows locally created scripts to run without being signed.

## Quick Start Commands (Using CMD)

```cmd
cd front
npm install
npm run dev
```

The app will be available at http://localhost:3000
