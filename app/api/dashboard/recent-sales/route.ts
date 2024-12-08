import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const recentSales = db.prepare(`
      SELECT 
        o.id,
        o.total,
        o.date,
        r.name,
        r.email,
        r.companyName
      FROM orders o
      JOIN representatives r ON o.user_id = r.id
      ORDER BY o.date DESC
      LIMIT 3
    `).all();

    const totalSalesThisMonth = db.prepare(`
      SELECT COUNT(*) as sale_count
      FROM orders
      WHERE date >= datetime('now', 'start of month')
    `).get();

    return NextResponse.json({
      recentSales,
      totalMonthSales: totalSalesThisMonth.sale_count
    })
  } catch (error) {
    console.error('Recent sales error:', error)
    return NextResponse.json({ error: 'Failed to fetch recent sales' }, { status: 500 })
  }
} 