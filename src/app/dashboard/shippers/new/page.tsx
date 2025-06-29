import ShipperForm from '@/components/forms/shipper-form'

export default function NewShipperPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Shipper</h1>
        <p className="text-gray-600">Create a new shipper company record</p>
      </div>
      
      <ShipperForm />
    </div>
  )
}
