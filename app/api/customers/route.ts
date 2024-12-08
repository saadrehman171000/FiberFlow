import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const customers = db.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all()
    return NextResponse.json(customers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, industry } = await request.json()
    
    if (!name || !email || !industry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingCustomer = db.prepare('SELECT id FROM customers WHERE email = ?').get(email)
    if (existingCustomer) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const result = db.prepare(
      'INSERT INTO customers (name, email, industry, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
    ).run(name, email, industry)

    return NextResponse.json({ id: result.lastInsertRowid })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
} 