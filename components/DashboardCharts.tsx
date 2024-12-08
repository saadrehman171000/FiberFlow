import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

interface ChartData {
  productsByCategory: Array<{ category: string; count: number }>
  customerGrowth: Array<{ month: string; new_customers: number }>
  companyDistribution: Array<{ status: string; count: number }>
  productTimeline: Array<{ month: string; new_products: number }>
}

export function DashboardCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/dashboard/charts')
        const data = await response.json()
        if (response.ok) {
          setChartData(data)
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (isLoading || !chartData) {
    return <div>Loading charts...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Products by Category - Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.productsByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Growth - Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Customer Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.customerGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="new_customers" 
              stroke="#00C49F" 
              name="New Customers"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Company Distribution - Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Company Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.companyDistribution}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.companyDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Product Timeline - Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Product Creation Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.productTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="new_products" 
              stroke="#FF8042" 
              name="New Products"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 