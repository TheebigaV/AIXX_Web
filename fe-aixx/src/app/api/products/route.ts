import { NextResponse } from 'next/server';
import { readProducts, writeProducts } from './data';

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const products = await readProducts();
  const newProduct: any = {
    id: Date.now().toString(),
    name: formData.get('name')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    is_active: formData.get('is_active') === 'true',
    main_product_image: formData.get('main_product_image')
      ? URL.createObjectURL(formData.get('main_product_image') as Blob)
      : null,
  };
  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
