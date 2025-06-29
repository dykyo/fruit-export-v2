import ContainerForm from '@/components/forms/container-form'

export default function NewContainerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Container</h1>
        <p className="text-gray-600">Create a new container record</p>
      </div>
      
      <ContainerForm />
    </div>
  )
}
