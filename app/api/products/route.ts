import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const products = db.prepare(`
            SELECT p.*, GROUP_CONCAT(sq.size || ':' || sq.quantity) as sizes
            FROM products p
            LEFT JOIN size_quantities sq ON p.id = sq.productId
            GROUP BY p.id
        `).all();

        const formattedProducts = products.map((product: any) => ({
            ...product,
            sizeQuantities: product.sizes
                ? Object.fromEntries(
                    product.sizes.split(',').map((size: string) => {
                        const [key, value] = size.split(':');
                        return [key, parseInt(value)];
                    })
                  )
                : {},
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const insertProduct = db.prepare(`
            INSERT INTO products (name, style, fabric, vendor, poDate, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const insertSizeQuantity = db.prepare(`
            INSERT INTO size_quantities (productId, size, quantity)
            VALUES (?, ?, ?)
        `);

        const result = db.transaction(() => {
            const { lastInsertRowid } = insertProduct.run(
                body.name,
                body.style,
                body.fabric,
                body.vendor,
                body.poDate,
                body.image
            );

            Object.entries(body.sizeQuantities).forEach(([size, quantity]) => {
                insertSizeQuantity.run(lastInsertRowid, size, quantity);
            });

            return lastInsertRowid;
        })();

        return NextResponse.json({ id: result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
