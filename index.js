import  express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import homeRouter from './Router/home.router.js';
import { connectDB } from './config/db.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.use('/', homeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});