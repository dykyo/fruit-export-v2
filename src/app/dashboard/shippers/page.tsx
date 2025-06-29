import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Ship, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getShippers() {
  const supabase = await createClient()

  const { data: shippers, error } = await supabase
    .from('shippers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching shippers:', error)
    return []
  }

  return shippers || []
}

export default async function ShippersPage() {
  const shippers = await getShippers()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipper Management</h1>
          <p className="text-gray-600">Manage export companies and their information</p>
        </div>
        <Link href="/dashboard/shippers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shipper
          </Button>
        </Link>
      </div>

      {/* Shippers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shippers.map((shipper) => (
          <Card key={shipper.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <Ship className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {shipper.name}
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {shipper.address}
                  </p>
                </div>
                
                {shipper.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{shipper.phone}</p>
                  </div>
                )}

                {shipper.fax && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Fax:</span>
                    <span className="text-sm text-gray-900">{shipper.fax}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(shipper.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link href={`/dashboard/shippers/${shipper.id}/edit`} className="flex-1">
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

      {shippers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shippers found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first shipper.</p>
            <Link href="/dashboard/shippers/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Shipper
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
