'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const containerSchema = z.object({
  container_number: z.string().min(1, 'Container number is required'),
  container_type: z.string().min(1, 'Container type is required'),
  size: z.string().min(1, 'Size is required'),
  status: z.enum(['available', 'in_use', 'maintenance'], {
    required_error: 'Please select a status',
  }),
})

type ContainerFormData = z.infer<typeof containerSchema>

interface ContainerFormProps {
  initialData?: Partial<ContainerFormData>
  isEdit?: boolean
  containerId?: string
}

const containerTypes = [
  '20ft Standard',
  '40ft Standard',
  '20ft High Cube',
  '40ft High Cube',
  '45ft High Cube',
  '20ft Refrigerated',
  '40ft Refrigerated',
  '20ft Open Top',
  '40ft Open Top',
  '20ft Flat Rack',
  '40ft Flat Rack',
  '20ft Tank',
  '40ft Tank',
]

const containerSizes = [
  '20ft',
  '40ft',
  '45ft',
]

export default function ContainerForm({ initialData, isEdit = false, containerId }: ContainerFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContainerFormData>({
    resolver: zodResolver(containerSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ContainerFormData) => {
    setLoading(true)
    setError('')

    try {
      if (isEdit && containerId) {
        // Update existing container
        const { error: updateError } = await supabase
          .from('containers')
          .update({
            container_number: data.container_number,
            container_type: data.container_type,
            size: data.size,
            status: data.status,
          })
          .eq('id', containerId)

        if (updateError) {
          setError(updateError.message)
          return
        }
      } else {
        // Create new container
        const { error: insertError } = await supabase
          .from('containers')
          .insert({
            container_number: data.container_number,
            container_type: data.container_type,
            size: data.size,
            status: data.status,
          })

        if (insertError) {
          setError(insertError.message)
          return
        }
      }

      router.push('/dashboard/containers')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEdit ? 'Edit Container' : 'Add New Container'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="container_number" className="block text-sm font-medium text-gray-700 mb-2">
              Container Number *
            </label>
            <Input
              id="container_number"
              type="text"
              placeholder="e.g., MSKU1234567"
              {...register('container_number')}
              className={errors.container_number ? 'border-red-500' : ''}
            />
            {errors.container_number && (
              <p className="mt-1 text-sm text-red-600">{errors.container_number.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="container_type" className="block text-sm font-medium text-gray-700 mb-2">
              Container Type *
            </label>
            <select
              id="container_type"
              {...register('container_type')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.container_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select container type</option>
              {containerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.container_type && (
              <p className="mt-1 text-sm text-red-600">{errors.container_type.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Size *
            </label>
            <select
              id="size"
              {...register('size')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select size</option>
              {containerSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              {...register('status')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select status</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isEdit ? 'Update Container' : 'Create Container'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
