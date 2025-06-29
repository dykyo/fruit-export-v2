import NotifyPartyForm from '@/components/forms/notify-party-form'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function NewNotifyPartyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Notify Party</h1>
        <p className="text-gray-600">Create a new notify party contact record</p>
      </div>
      
      <NotifyPartyForm />
    </div>
  )
}
