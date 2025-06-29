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

const notifyPartySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  usci: z.string().optional(),
  contact_person: z.string().optional(),
})

type NotifyPartyFormData = z.infer<typeof notifyPartySchema>

interface NotifyPartyFormProps {
  initialData?: Partial<NotifyPartyFormData>
  isEdit?: boolean
  notifyPartyId?: string
}

export default function NotifyPartyForm({ initialData, isEdit = false, notifyPartyId }: NotifyPartyFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NotifyPartyFormData>({
    resolver: zodResolver(notifyPartySchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: NotifyPartyFormData) => {
    setLoading(true)
    setError('')

    try {
      const formData = {
        name: data.name,
        address: data.address,
        phone: data.phone || null,
        fax: data.fax || null,
        email: data.email || null,
        usci: data.usci || null,
        contact_person: data.contact_person || null,
      }

      if (isEdit && notifyPartyId) {
        // Update existing notify party
        const { error: updateError } = await supabase
          .from('notify_parties')
          .update(formData)
          .eq('id', notifyPartyId)

        if (updateError) {
          setError(updateError.message)
          return
        }
      } else {
        // Create new notify party
        const { error: insertError } = await supabase
          .from('notify_parties')
          .insert(formData)

        if (insertError) {
          setError(insertError.message)
          return
        }
      }

      router.push('/dashboard/notify-parties')
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
          {isEdit ? 'Edit Notify Party' : 'Add New Notify Party'}
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
              placeholder="e.g., BEIJING JUNYAO INTERNATIONAL"
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
              placeholder="e.g., COURTYARD 2, JIAOGEZHUANG STREET NANFAXIN TOWN, SHUNYI DISTRICT, BEIJING, CHINA, 101300."
              {...register('address')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                id="phone"
                type="text"
                placeholder="e.g., 0086-13911653846"
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
                placeholder="e.g., 0086-13911653846"
                {...register('fax')}
                className={errors.fax ? 'border-red-500' : ''}
              />
              {errors.fax && (
                <p className="mt-1 text-sm text-red-600">{errors.fax.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., docs.list@bjncei.com, gm@bjncei.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="usci" className="block text-sm font-medium text-gray-700 mb-2">
                USCI (Unified Social Credit Identifier)
              </label>
              <Input
                id="usci"
                type="text"
                placeholder="e.g., 91110113MA003ATG6P"
                {...register('usci')}
                className={errors.usci ? 'border-red-500' : ''}
              />
              {errors.usci && (
                <p className="mt-1 text-sm text-red-600">{errors.usci.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <Input
                id="contact_person"
                type="text"
                placeholder="e.g., Ms.Lv Huibin"
                {...register('contact_person')}
                className={errors.contact_person ? 'border-red-500' : ''}
              />
              {errors.contact_person && (
                <p className="mt-1 text-sm text-red-600">{errors.contact_person.message}</p>
              )}
            </div>
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
              {isEdit ? 'Update Notify Party' : 'Create Notify Party'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
