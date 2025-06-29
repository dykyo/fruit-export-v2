import ConsigneeForm from '@/components/forms/consignee-form'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function NewConsigneePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Consignee</h1>
        <p className="text-gray-600">Create a new consignee company record</p>
      </div>
      
      <ConsigneeForm />
    </div>
  )
}
