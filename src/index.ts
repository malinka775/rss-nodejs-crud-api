import dotenv from 'dotenv';
import { server } from './server';

dotenv.config({ path: __dirname + '/.env'});

const PORT: number = Number(process.env.PORT) || 8000;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
