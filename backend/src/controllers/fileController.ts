const fs = require('fs');

// Синхронное чтение
const fileBuffer = fs.readFileSync('path/to/file');
console.log(fileBuffer.toString()); // Для текстовых файлов

// Асинхронное чтение
fs.readFile('path/to/file', (err: any, data: any) => {
    if (err) throw err;
    console.log(data.toString()); // Для текстовых файлов
});