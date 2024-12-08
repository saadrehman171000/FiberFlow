import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // Products by Category
    const productsByCategory = db.prepare(`
      SELECT fabric as category, COUNT(*) as count 
      FROM products 
      GROUP BY fabric
    `).all();

    // Monthly Customer Growth
    const customerGrowth = db.prepare(`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as new_customers
      FROM customers
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
      LIMIT 6
    `).all();

    // Company Distribution
    const companyDistribution = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM representatives
      GROUP BY status
    `).all();

    // Product Creation Timeline
    const productTimeline = db.prepare(`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as new_products
      FROM products
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
      LIMIT 6
    `).all();

    return NextResponse.json({
      productsByCategory,
      customerGrowth: customerGrowth.reverse(), // Reverse to show chronological order
      companyDistribution,
      productTimeline: productTimeline.reverse()
    })
  } catch (error) {
    console.error('Charts data error:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
} 