import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(params.id)
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }
    return NextResponse.json(customer)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, industry } = await request.json()
    
    if (!name || !email || !industry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingCustomer = db.prepare('SELECT id FROM customers WHERE email = ? AND id != ?').get(email, params.id)
    if (existingCustomer) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    db.prepare('UPDATE customers SET name = ?, email = ?, industry = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(name, email, industry, params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM customers WHERE id = ?').run(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}