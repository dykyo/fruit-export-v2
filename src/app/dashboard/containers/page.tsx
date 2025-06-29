import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Container, Package, Ruler } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getContainers() {
  const supabase = await createClient()

  const { data: containers, error } = await supabase
    .from('containers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching containers:', error)
    return []
  }

  return containers || []
}

export default async function ContainersPage() {
  const containers = await getContainers()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'in_use':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Container Management</h1>
          <p className="text-gray-600">Manage shipping containers and their status</p>
        </div>
        <Link href="/dashboard/containers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Container
          </Button>
        </Link>
      </div>

      {/* Containers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((container) => (
          <Card key={container.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <Container className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-mono">
                      {container.container_number}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{container.container_type}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(container.status)}`}>
                  {container.status.replace('_', ' ')}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm text-gray-900">{container.container_type}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="text-sm text-gray-900">{container.size}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(container.status)}`}>
                    {container.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(container.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link href={`/dashboard/containers/${container.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {containers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Container className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No containers found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first container.</p>
            <Link href="/dashboard/containers/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Container
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
