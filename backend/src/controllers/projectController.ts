const AdmZip = require('adm-zip');

// Открыть архив
const zip = new AdmZip('path/to/your.zip');

// Список файлов в архиве
const zipEntries = zip.getEntries();

zipEntries.forEach((entry: any) => {
    console.log(`Имя файла: ${entry.entryName}`);
    if (!entry.isDirectory) {
        const content = entry.getData().toString(); // Для текстовых файлов
        console.log(`Содержимое: ${content}`);
    }
});

// Извлечение архива
zip.extractAllTo('path/to/extract', true);