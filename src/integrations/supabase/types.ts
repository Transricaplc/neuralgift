export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          metadata: Json
          path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          metadata?: Json
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          metadata?: Json
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      business_accounts: {
        Row: {
          billing_email: string | null
          company_name: string | null
          created_at: string
          id: string
          plan_tier: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          billing_email?: string | null
          company_name?: string | null
          created_at?: string
          id: string
          plan_tier?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          billing_email?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          plan_tier?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      gift_deliveries: {
        Row: {
          created_at: string
          delivery_method: string
          id: string
          occasion: string | null
          opened_at: string | null
          order_id: string | null
          personal_message: string | null
          recipient_contact: string | null
          redeemed_at: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          delivery_method: string
          id?: string
          occasion?: string | null
          opened_at?: string | null
          order_id?: string | null
          personal_message?: string | null
          recipient_contact?: string | null
          redeemed_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          delivery_method?: string
          id?: string
          occasion?: string | null
          opened_at?: string | null
          order_id?: string | null
          personal_message?: string | null
          recipient_contact?: string | null
          redeemed_at?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          status: string
          team_size: string
          use_case: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: string
          team_size: string
          use_case?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: string
          team_size?: string
          use_case?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          buyer_email: string
          buyer_user_id: string | null
          country_code: string | null
          created_at: string
          currency: string
          currency_code: string
          delivery_type: string
          exchange_rate: number
          gift_mode: boolean
          id: string
          is_crypto_payment: boolean
          local_amount: number | null
          message: string | null
          occasion: string | null
          paid_at: string | null
          payment_method_key: string
          psp: string
          quantity: number
          recipient_email: string | null
          recipient_whatsapp: string | null
          redemption_code: string
          referral_code: string | null
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          buyer_email: string
          buyer_user_id?: string | null
          country_code?: string | null
          created_at?: string
          currency?: string
          currency_code?: string
          delivery_type?: string
          exchange_rate?: number
          gift_mode?: boolean
          id?: string
          is_crypto_payment?: boolean
          local_amount?: number | null
          message?: string | null
          occasion?: string | null
          paid_at?: string | null
          payment_method_key?: string
          psp?: string
          quantity?: number
          recipient_email?: string | null
          recipient_whatsapp?: string | null
          redemption_code?: string
          referral_code?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          buyer_email?: string
          buyer_user_id?: string | null
          country_code?: string | null
          created_at?: string
          currency?: string
          currency_code?: string
          delivery_type?: string
          exchange_rate?: number
          gift_mode?: boolean
          id?: string
          is_crypto_payment?: boolean
          local_amount?: number | null
          message?: string | null
          occasion?: string | null
          paid_at?: string | null
          payment_method_key?: string
          psp?: string
          quantity?: number
          recipient_email?: string | null
          recipient_whatsapp?: string | null
          redemption_code?: string
          referral_code?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          buyer_ip_country: string | null
          completed_at: string | null
          created_at: string
          crypto_address: string | null
          crypto_network: string | null
          crypto_token: string | null
          crypto_tx_hash: string | null
          exchange_rate: number | null
          id: string
          local_amount: number | null
          local_currency: string | null
          order_id: string | null
          payment_method_key: string
          phone_number: string | null
          platform_commission_pct: number | null
          provider_reference: string | null
          psp: string
          status: string
          usd_amount: number | null
          voucher_code: string | null
        }
        Insert: {
          buyer_ip_country?: string | null
          completed_at?: string | null
          created_at?: string
          crypto_address?: string | null
          crypto_network?: string | null
          crypto_token?: string | null
          crypto_tx_hash?: string | null
          exchange_rate?: number | null
          id?: string
          local_amount?: number | null
          local_currency?: string | null
          order_id?: string | null
          payment_method_key: string
          phone_number?: string | null
          platform_commission_pct?: number | null
          provider_reference?: string | null
          psp: string
          status?: string
          usd_amount?: number | null
          voucher_code?: string | null
        }
        Update: {
          buyer_ip_country?: string | null
          completed_at?: string | null
          created_at?: string
          crypto_address?: string | null
          crypto_network?: string | null
          crypto_token?: string | null
          crypto_tx_hash?: string | null
          exchange_rate?: number | null
          id?: string
          local_amount?: number | null
          local_currency?: string | null
          order_id?: string | null
          payment_method_key?: string
          phone_number?: string | null
          platform_commission_pct?: number | null
          provider_reference?: string | null
          psp?: string
          status?: string
          usd_amount?: number | null
          voucher_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_requests: {
        Row: {
          created_at: string
          id: string
          request_type: string
          requested_value: string
          requester_country: string | null
          requester_email: string | null
          vote_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          request_type: string
          requested_value: string
          requester_country?: string | null
          requester_email?: string | null
          vote_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          request_type?: string
          requested_value?: string
          requester_country?: string | null
          requester_email?: string | null
          vote_count?: number
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          id: string
          order_id: string
          redeemed_at: string
          services_selected: Json
        }
        Insert: {
          id?: string
          order_id: string
          redeemed_at?: string
          services_selected: Json
        }
        Update: {
          id?: string
          order_id?: string
          redeemed_at?: string
          services_selected?: Json
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          credit_cents: number
          discount_cents: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
          owner_email: string | null
          owner_user_id: string | null
          updated_at: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          credit_cents?: number
          discount_cents?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          owner_email?: string | null
          owner_user_id?: string | null
          updated_at?: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          credit_cents?: number
          discount_cents?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          owner_email?: string | null
          owner_user_id?: string | null
          updated_at?: string
          uses_count?: number
        }
        Relationships: []
      }
      referral_redemptions: {
        Row: {
          buyer_email: string | null
          code: string
          created_at: string
          credit_cents: number
          discount_cents: number
          id: string
          order_id: string | null
          referral_code_id: string
        }
        Insert: {
          buyer_email?: string | null
          code: string
          created_at?: string
          credit_cents?: number
          discount_cents?: number
          id?: string
          order_id?: string | null
          referral_code_id: string
        }
        Update: {
          buyer_email?: string | null
          code?: string
          created_at?: string
          credit_cents?: number
          discount_cents?: number
          id?: string
          order_id?: string | null
          referral_code_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_redemptions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          access_note: string | null
          available_payment_methods: Json
          country_code: string
          country_name: string
          coverage_status: string
          currency_code: string
          currency_symbol: string
          emoji: string | null
          exchange_rate_usd: number
          id: string
          is_active: boolean
          micro_bundle_usd: number | null
          primary_psp: string | null
          updated_at: string
        }
        Insert: {
          access_note?: string | null
          available_payment_methods?: Json
          country_code: string
          country_name: string
          coverage_status?: string
          currency_code: string
          currency_symbol: string
          emoji?: string | null
          exchange_rate_usd?: number
          id?: string
          is_active?: boolean
          micro_bundle_usd?: number | null
          primary_psp?: string | null
          updated_at?: string
        }
        Update: {
          access_note?: string | null
          available_payment_methods?: Json
          country_code?: string
          country_name?: string
          coverage_status?: string
          currency_code?: string
          currency_symbol?: string
          emoji?: string | null
          exchange_rate_usd?: number
          id?: string
          is_active?: boolean
          micro_bundle_usd?: number | null
          primary_psp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      token_bundles: {
        Row: {
          bundle_name: string
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          fulfillment_type: string
          id: string
          is_active: boolean
          is_giftable: boolean
          platform: string
          token_quantity: number | null
          token_unit: string | null
          usd_price: number
        }
        Insert: {
          bundle_name: string
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          fulfillment_type?: string
          id?: string
          is_active?: boolean
          is_giftable?: boolean
          platform: string
          token_quantity?: number | null
          token_unit?: string | null
          usd_price: number
        }
        Update: {
          bundle_name?: string
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          fulfillment_type?: string
          id?: string
          is_active?: boolean
          is_giftable?: boolean
          platform?: string
          token_quantity?: number | null
          token_unit?: string | null
          usd_price?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_referral_to_order: {
        Args: { _code: string; _order_id: string }
        Returns: Json
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_gift_track: {
        Args: { _order_id: string }
        Returns: {
          delivery_method: string
          opened_at: string
          order_id: string
          order_status: string
          redeemed_at: string
          sent_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_order_by_code: {
        Args: { _code: string }
        Returns: {
          amount: number
          created_at: string
          id: string
          message: string
          recipient_email: string
          status: string
        }[]
      }
      mark_gift_opened: { Args: { _order_id: string }; Returns: Json }
      mark_gift_sent: { Args: { _order_id: string }; Returns: Json }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      redeem_order: { Args: { _code: string; _services: Json }; Returns: Json }
      validate_referral_code: {
        Args: { _code: string }
        Returns: {
          credit_cents: number
          discount_cents: number
          ok: boolean
          reason: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
