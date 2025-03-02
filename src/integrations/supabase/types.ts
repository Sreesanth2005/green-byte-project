export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      eco_tips: {
        Row: {
          category: string
          created_at: string | null
          id: string
          tip: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          tip: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          tip?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          email: string
          event_id: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          registration_date: string | null
          user_id: string
        }
        Insert: {
          email: string
          event_id: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          registration_date?: string | null
          user_id: string
        }
        Update: {
          email?: string
          event_id?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          registration_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string
          event_date: string
          event_time: string
          id: string
          image_url: string | null
          location: string
          max_participants: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description: string
          event_date: string
          event_time: string
          id?: string
          image_url?: string | null
          location: string
          max_participants?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string
          event_date?: string
          event_time?: string
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          available: boolean | null
          category: string
          condition: string
          created_at: string | null
          description: string
          eco_credits: number
          id: string
          image_url: string
          name: string
          price: number
          rating: number | null
          reviews: number | null
          specs: string[] | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category: string
          condition: string
          created_at?: string | null
          description: string
          eco_credits: number
          id?: string
          image_url: string
          name: string
          price: number
          rating?: number | null
          reviews?: number | null
          specs?: string[] | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string
          condition?: string
          created_at?: string | null
          description?: string
          eco_credits?: number
          id?: string
          image_url?: string
          name?: string
          price?: number
          rating?: number | null
          reviews?: number | null
          specs?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apartment_number: string | null
          city: string | null
          created_at: string | null
          eco_credits: number | null
          first_name: string | null
          id: string
          last_name: string | null
          level: string | null
          phone: string | null
          pin_code: string | null
          state: string | null
          street_address: string | null
          updated_at: string | null
        }
        Insert: {
          apartment_number?: string | null
          city?: string | null
          created_at?: string | null
          eco_credits?: number | null
          first_name?: string | null
          id: string
          last_name?: string | null
          level?: string | null
          phone?: string | null
          pin_code?: string | null
          state?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Update: {
          apartment_number?: string | null
          city?: string | null
          created_at?: string | null
          eco_credits?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          level?: string | null
          phone?: string | null
          pin_code?: string | null
          state?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_pickups: {
        Row: {
          address: string
          category: string
          created_at: string | null
          eco_credits_earned: number | null
          email: string
          first_name: string
          id: string
          image_urls: string[] | null
          last_name: string
          phone: string
          pickup_date: string
          pickup_time: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          category: string
          created_at?: string | null
          eco_credits_earned?: number | null
          email: string
          first_name: string
          id?: string
          image_urls?: string[] | null
          last_name: string
          phone: string
          pickup_date: string
          pickup_time: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          category?: string
          created_at?: string | null
          eco_credits_earned?: number | null
          email?: string
          first_name?: string
          id?: string
          image_urls?: string[] | null
          last_name?: string
          phone?: string
          pickup_date?: string
          pickup_time?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          payment_reference: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          payment_reference?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          payment_reference?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          earned_from_recycling: number | null
          eco_credits: number | null
          first_name: string | null
          id: string | null
          last_name: string | null
          level: string | null
          total_pickups: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_eco_credits: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
