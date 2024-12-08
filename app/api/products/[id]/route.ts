import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = db.prepare(`
            SELECT p.*, GROUP_CONCAT(sq.size || ':' || sq.quantity) as sizes
            FROM products p
            LEFT JOIN size_quantities sq ON p.id = sq.productId
            WHERE p.id = ?
            GROUP BY p.id
        `).get(params.id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const formattedProduct = {
            ...product,
            sizeQuantities: product.sizes
                ? Object.fromEntries(
                    product.sizes.split(',').map((size: string) => {
                        const [key, value] = size.split(':');
                        return [key, parseInt(value)];
                    })
                  )
                : {},
        };

        return NextResponse.json(formattedProduct);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const updateProduct = db.prepare(`
            UPDATE products 
            SET name = ?, style = ?, fabric = ?, vendor = ?, poDate = ?, image = ?
            WHERE id = ?
        `);

        const deleteSizeQuantities = db.prepare(`
            DELETE FROM size_quantities WHERE productId = ?
        `);

        const insertSizeQuantity = db.prepare(`
            INSERT INTO size_quantities (productId, size, quantity)
            VALUES (?, ?, ?)
        `);

        db.transaction(() => {
            updateProduct.run(
                body.name,
                body.style,
                body.fabric,
                body.vendor,
                body.poDate,
                body.image,
                params.id
            );

            deleteSizeQuantities.run(params.id);

            Object.entries(body.sizeQuantities).forEach(([size, quantity]) => {
                insertSizeQuantity.run(params.id, size, quantity);
            });
        })();

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        db.prepare('DELETE FROM products WHERE id = ?').run(params.id);
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
