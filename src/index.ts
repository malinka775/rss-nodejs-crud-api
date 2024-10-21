import { resolve } from 'node:path';
import dotenv from 'dotenv';
import { server } from './server';

dotenv.config({ path: resolve(__dirname, '../.env') });

const PORT: number = Number(process.env.PORT) || 8000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
