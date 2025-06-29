import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Bell, Phone, MapPin, Mail, User } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getNotifyParties() {
  const supabase = await createClient()

  const { data: notifyParties, error } = await supabase
    .from('notify_parties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notify parties:', error)
    return []
  }

  return notifyParties || []
}

export default async function NotifyPartiesPage() {
  const notifyParties = await getNotifyParties()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notify Party Management</h1>
          <p className="text-gray-600">Manage notification contacts and their information</p>
        </div>
        <Link href="/dashboard/notify-parties/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Notify Party
          </Button>
        </Link>
      </div>

      {/* Notify Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifyParties.map((notifyParty) => (
          <Card key={notifyParty.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {notifyParty.name}
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
                    {notifyParty.address}
                  </p>
                </div>
                
                {notifyParty.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{notifyParty.phone}</p>
                  </div>
                )}

                {notifyParty.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600 truncate">{notifyParty.email}</p>
                  </div>
                )}

                {notifyParty.contact_person && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-600">{notifyParty.contact_person}</p>
                  </div>
                )}

                {notifyParty.usci && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">USCI:</span>
                    <span className="text-sm text-gray-900 font-mono">{notifyParty.usci}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(notifyParty.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link href={`/dashboard/notify-parties/${notifyParty.id}/edit`} className="flex-1">
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

      {notifyParties.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notify parties found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first notify party.</p>
            <Link href="/dashboard/notify-parties/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Notify Party
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
