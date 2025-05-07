
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          title: string
          start_time: string
          end_time: string
          calendar_type: string
          attendees: string[]
          is_virtual: boolean
          location?: string
          platform?: string
          description?: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          start_time: string
          end_time: string
          calendar_type: string
          attendees?: string[]
          is_virtual: boolean
          location?: string
          platform?: string
          description?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          start_time?: string
          end_time?: string
          calendar_type?: string
          attendees?: string[]
          is_virtual?: boolean
          location?: string
          platform?: string
          description?: string
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          time_zone: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          time_zone?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          time_zone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
