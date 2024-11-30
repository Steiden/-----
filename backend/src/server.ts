import app from './app';
import apiRoutes from './routes/api';

const PORT = process.env.PORT || 3000;

// Use API routes
app.use('/api', apiRoutes);
// app.use((err: any, req: Request, res: Response, next: Function) => {
//     if (err instanceof multer.MulterError) {
//         res.status(400).send(`Ошибка загрузки файла: ${err.message}`);
//     } else if (err) {
//         res.status(500).send(`Ошибка: ${err.message}`);
//     } else {
//         next();
//     }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
