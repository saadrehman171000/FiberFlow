import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // Get total products
    const productsCount = db.prepare(`
      SELECT COUNT(*) as count FROM products
    `).get();

    // Get total customers
    const customersCount = db.prepare(`
      SELECT COUNT(*) as count FROM customers
    `).get();

    // Get total companies (representatives)
    const companiesCount = db.prepare(`
      SELECT COUNT(*) as count FROM representatives
    `).get();

    return NextResponse.json({
      totalProducts: productsCount.count,
      totalCustomers: customersCount.count,
      totalCompanies: companiesCount.count
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 })
  }
} 