export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      shippers: {
        Row: {
          id: string
          name: string
          address: string
          phone: string | null
          fax: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone?: string | null
          fax?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string | null
          fax?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      consignees: {
        Row: {
          id: string
          name: string
          address: string
          phone: string | null
          fax: string | null
          email: string | null
          usci: string | null
          contact_person: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone?: string | null
          fax?: string | null
          email?: string | null
          usci?: string | null
          contact_person?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string | null
          fax?: string | null
          email?: string | null
          usci?: string | null
          contact_person?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notify_parties: {
        Row: {
          id: string
          name: string
          address: string
          phone: string | null
          fax: string | null
          email: string | null
          usci: string | null
          contact_person: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone?: string | null
          fax?: string | null
          email?: string | null
          usci?: string | null
          contact_person?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string | null
          fax?: string | null
          email?: string | null
          usci?: string | null
          contact_person?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      containers: {
        Row: {
          id: string
          container_number: string
          container_type: string
          size: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          container_number: string
          container_type: string
          size: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          container_number?: string
          container_type?: string
          size?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'user'
      container_status: 'available' | 'in_use' | 'maintenance'
    }
  }
}
