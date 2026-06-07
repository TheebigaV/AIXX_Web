import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'app', 'api', 'products', 'data.json');

export async function readProducts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or is empty, start with empty array
    return [];
  }
}

export async function writeProducts(products: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}
