import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserForm from '@/components/forms/user-form'

async function checkAdminAccess() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/unauthorized')
  }
}

export default async function NewUserPage() {
  await checkAdminAccess()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        <p className="text-gray-600">Create a new user account with appropriate permissions</p>
      </div>
      
      <UserForm />
    </div>
  )
}
