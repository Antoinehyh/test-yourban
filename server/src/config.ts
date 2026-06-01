import path from 'path';

// Points to box-office-200.json at the project root
// Works both in development (src/) and after compilation (dist/)
export const DATA_PATH = path.resolve(__dirname, '..', '..', 'box-office-200.json');

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
