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

const shipperSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
})

type ShipperFormData = z.infer<typeof shipperSchema>

interface ShipperFormProps {
  initialData?: Partial<ShipperFormData>
  isEdit?: boolean
  shipperId?: string
}

export default function ShipperForm({ initialData, isEdit = false, shipperId }: ShipperFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShipperFormData>({
    resolver: zodResolver(shipperSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ShipperFormData) => {
    setLoading(true)
    setError('')

    try {
      if (isEdit && shipperId) {
        // Update existing shipper
        const { error: updateError } = await supabase
          .from('shippers')
          .update({
            name: data.name,
            address: data.address,
            phone: data.phone || null,
            fax: data.fax || null,
          })
          .eq('id', shipperId)

        if (updateError) {
          setError(updateError.message)
          return
        }
      } else {
        // Create new shipper
        const { error: insertError } = await supabase
          .from('shippers')
          .insert({
            name: data.name,
            address: data.address,
            phone: data.phone || null,
            fax: data.fax || null,
          })

        if (insertError) {
          setError(insertError.message)
          return
        }
      }

      router.push('/dashboard/shippers')
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
          {isEdit ? 'Edit Shipper' : 'Add New Shipper'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., DYY TRADING INTL CO., LTD."
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="e.g., 101 MOO 7 WIANG SUBDISTRICT, CHIANGSAEN DISTRICT CHIANGRAI 57150 THAILAND"
              {...register('address')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <Input
              id="phone"
              type="text"
              placeholder="e.g., 053-650066"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fax" className="block text-sm font-medium text-gray-700 mb-2">
              Fax
            </label>
            <Input
              id="fax"
              type="text"
              placeholder="e.g., 053-650066"
              {...register('fax')}
              className={errors.fax ? 'border-red-500' : ''}
            />
            {errors.fax && (
              <p className="mt-1 text-sm text-red-600">{errors.fax.message}</p>
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
              {isEdit ? 'Update Shipper' : 'Create Shipper'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
