console.log('Testing Node.js execution in current directory');
console.log('Current working directory:', process.cwd());
console.log('Directory contents:');
const fs = require('fs');
try {
    const files = fs.readdirSync('.');
    console.log(files);
} catch (error) {
    console.error('Error reading directory:', error);
}
