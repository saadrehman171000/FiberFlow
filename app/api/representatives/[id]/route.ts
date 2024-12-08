import { NextResponse } from 'next/server'
import  db from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const representative = await db.get(
      'SELECT * FROM representatives WHERE id = ?',
      params.id
    )

    if (!representative) {
      return NextResponse.json({ error: 'Representative not found' }, { status: 404 })
    }

    return NextResponse.json(representative)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch representative' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {
      companyName,
      name,
      designation,
      email,
      phoneNumber,
      whatsappNumber,
      address,
      cnicNumber,
      status
    } = await request.json()

    await db.run(
      `UPDATE representatives SET 
        companyName = ?, 
        name = ?, 
        designation = ?, 
        email = ?, 
        phoneNumber = ?, 
        whatsappNumber = ?, 
        address = ?, 
        cnicNumber = ?, 
        status = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [companyName, name, designation, email, phoneNumber, whatsappNumber, address, cnicNumber, status, params.id]
    )

    const updatedRepresentative = await db.get(
      'SELECT * FROM representatives WHERE id = ?',
      params.id
    )

    return NextResponse.json(updatedRepresentative)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update representative' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.run('DELETE FROM representatives WHERE id = ?', params.id)
    return NextResponse.json({ message: 'Representative deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete representative' }, { status: 500 })
  }
} 