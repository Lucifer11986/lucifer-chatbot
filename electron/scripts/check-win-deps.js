#!/usr/bin/env node
const { execSync } = require('child_process');

function hasBinary(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

if (process.platform === 'win32') {
  process.exit(0);
}

const missing = [];

if (!hasBinary('wine')) {
  missing.push('wine');
}

// electron-builder empfiehlt mono unter Linux/macOS für die Windows-Signierung
if ((process.platform === 'linux' || process.platform === 'darwin') && !hasBinary('mono')) {
  missing.push('mono');
}

if (missing.length > 0) {
  console.error(`\nFehlende Abhängigkeiten für Windows-Builds: ${missing.join(', ')}`);
  console.error('Installiere die oben genannten Pakete (z. B. `sudo apt install wine mono-complete`) oder führe den Build unter Windows aus.');
  console.error('Weitere Hinweise findest du im README unter "Windows-Installer (.exe) bauen".');
  process.exit(1);
}
