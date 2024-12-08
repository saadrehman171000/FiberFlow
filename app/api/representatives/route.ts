import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const representatives = db.prepare('SELECT * FROM representatives ORDER BY createdAt DESC').all()
    return NextResponse.json(representatives)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch representatives' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = db.prepare(`
      INSERT INTO representatives (
        companyName, name, designation, email, phoneNumber, 
        whatsappNumber, address, cnicNumber, status, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(data.companyName, data.name, data.designation, data.email, data.phoneNumber, 
          data.whatsappNumber, data.address, data.cnicNumber, data.status)

    const newRepresentative = db.prepare('SELECT * FROM representatives WHERE id = ?').get(result.lastInsertRowid)
    return NextResponse.json(newRepresentative)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create representative' }, { status: 500 })
  }
} 