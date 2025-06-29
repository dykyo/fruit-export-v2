import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Building2, Phone, MapPin, Mail, User } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getConsignees() {
  const supabase = await createClient()

  const { data: consignees, error } = await supabase
    .from('consignees')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching consignees:', error)
    return []
  }

  return consignees || []
}

export default async function ConsigneesPage() {
  const consignees = await getConsignees()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consignee Management</h1>
          <p className="text-gray-600">Manage import companies and their information</p>
        </div>
        <Link href="/dashboard/consignees/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Consignee
          </Button>
        </Link>
      </div>

      {/* Consignees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consignees.map((consignee) => (
          <Card key={consignee.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {consignee.name}
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
                    {consignee.address}
                  </p>
                </div>
                
                {consignee.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{consignee.phone}</p>
                  </div>
                )}

                {consignee.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600 truncate">{consignee.email}</p>
                  </div>
                )}

                {consignee.contact_person && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{consignee.contact_person}</p>
                  </div>
                )}

                {consignee.usci && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">USCI:</span>
                    <span className="text-sm text-gray-900 font-mono">{consignee.usci}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(consignee.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link href={`/dashboard/consignees/${consignee.id}/edit`} className="flex-1">
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

      {consignees.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consignees found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first consignee.</p>
            <Link href="/dashboard/consignees/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Consignee
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
