import { NextResponse } from 'next/server';
import { products } from '../data';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const idx = products.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const formData = await request.formData();
  const updated = {
    ...products[idx],
    name: formData.get('name')?.toString() || products[idx].name,
    description: formData.get('description')?.toString() || products[idx].description,
    is_active: formData.get('is_active') === 'true',
    main_product_image: formData.get('main_product_image')
      ? URL.createObjectURL(formData.get('main_product_image') as Blob)
      : products[idx].main_product_image,
  };
  products[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const idx = products.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  products.splice(idx, 1);
  return NextResponse.json({ success: true });
}
