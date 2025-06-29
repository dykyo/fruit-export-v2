import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ship, Building2, Bell, Container, Users, TrendingUp } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: shippersCount },
    { count: consigneesCount },
    { count: notifyPartiesCount },
    { count: containersCount },
    { count: usersCount }
  ] = await Promise.all([
    supabase.from('shippers').select('*', { count: 'exact', head: true }),
    supabase.from('consignees').select('*', { count: 'exact', head: true }),
    supabase.from('notify_parties').select('*', { count: 'exact', head: true }),
    supabase.from('containers').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true })
  ])

  return {
    shippersCount: shippersCount || 0,
    consigneesCount: consigneesCount || 0,
    notifyPartiesCount: notifyPartiesCount || 0,
    containersCount: containersCount || 0,
    usersCount: usersCount || 0
  }
}

async function getRecentActivity() {
  const supabase = await createClient()

  // Get recent containers (as an example of recent activity)
  const { data: recentContainers } = await supabase
    .from('containers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return recentContainers || []
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentActivity = await getRecentActivity()

  const statCards = [
    {
      title: 'Total Shippers',
      value: stats.shippersCount,
      icon: Ship,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Consignees',
      value: stats.consigneesCount,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Notify Parties',
      value: stats.notifyPartiesCount,
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Containers',
      value: stats.containersCount,
      icon: Container,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Users',
      value: stats.usersCount,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your fruit export management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active records
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Container Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((container) => (
                  <div key={container.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{container.container_number}</p>
                      <p className="text-sm text-gray-500">{container.container_type} - {container.size}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        container.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : container.status === 'in_use'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {container.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/dashboard/shippers"
                className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Ship className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-900">Manage Shippers</span>
                </div>
              </a>
              <a
                href="/dashboard/consignees"
                className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-900">Manage Consignees</span>
                </div>
              </a>
              <a
                href="/dashboard/containers"
                className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Container className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-900">Manage Containers</span>
                </div>
              </a>
              <a
                href="/dashboard/notify-parties"
                className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="font-medium text-yellow-900">Manage Notify Parties</span>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
