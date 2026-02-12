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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      cscs_results: {
        Row: {
          attempted_at: string | null
          id: string
          passed: boolean | null
          score: number | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          passed?: boolean | null
          score?: number | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          id?: string
          passed?: boolean | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      gqa_results: {
        Row: {
          attempted_at: string | null
          id: string
          module_id: number
          passed: boolean | null
          score: number | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          module_id: number
          passed?: boolean | null
          score?: number | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          id?: string
          module_id?: number
          passed?: boolean | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mock_attempts: {
        Row: {
          attempted_at: string | null
          duration_seconds: number | null
          id: string
          score: number | null
          total: number | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          duration_seconds?: number | null
          id?: string
          score?: number | null
          total?: number | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          duration_seconds?: number | null
          id?: string
          score?: number | null
          total?: number | null
          user_id?: string
        }
        Relationships: []
      }
      practice_attempts: {
        Row: {
          answers_json: Json | null
          attempted_at: string | null
          id: string
          mode: string
          module_id: number
          percentage: number | null
          score: number | null
          total: number | null
          user_id: string
        }
        Insert: {
          answers_json?: Json | null
          attempted_at?: string | null
          id?: string
          mode: string
          module_id: number
          percentage?: number | null
          score?: number | null
          total?: number | null
          user_id: string
        }
        Update: {
          answers_json?: Json | null
          attempted_at?: string | null
          id?: string
          mode?: string
          module_id?: number
          percentage?: number | null
          score?: number | null
          total?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          selected_language: string | null
          super_user: boolean | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          selected_language?: string | null
          super_user?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          selected_language?: string | null
          super_user?: boolean | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean | null
          id: string
          lesson_id: string
          mini_check_score: Json | null
          module_id: number
          time_spent_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          id?: string
          lesson_id: string
          mini_check_score?: Json | null
          module_id: number
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          id?: string
          lesson_id?: string
          mini_check_score?: Json | null
          module_id?: number
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      readiness_snapshots: {
        Row: {
          components: Json | null
          computed_at: string | null
          gates: Json | null
          id: string
          next_action: string | null
          readiness: number | null
          tier: string | null
          user_id: string
          weak_modules: number[] | null
        }
        Insert: {
          components?: Json | null
          computed_at?: string | null
          gates?: Json | null
          id?: string
          next_action?: string | null
          readiness?: number | null
          tier?: string | null
          user_id: string
          weak_modules?: number[] | null
        }
        Update: {
          components?: Json | null
          computed_at?: string | null
          gates?: Json | null
          id?: string
          next_action?: string | null
          readiness?: number | null
          tier?: string | null
          user_id?: string
          weak_modules?: number[] | null
        }
        Relationships: []
      }
      streaks: {
        Row: {
          current_streak: number | null
          id: string
          last_active_date: string | null
          longest_streak: number | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          id?: string
          last_active_date?: string | null
          longest_streak?: number | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          id?: string
          last_active_date?: string | null
          longest_streak?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_module_stats: {
        Row: {
          avg_practice_score: number | null
          best_practice_score: number | null
          gqa_passed: boolean | null
          gqa_score: number | null
          lessons_completed: number | null
          module_id: number | null
          total_practice_attempts: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      compute_readiness: { Args: { p_user_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_user: { Args: { _user_id: string }; Returns: boolean }
      set_super_user: { Args: { target_id: string }; Returns: undefined }
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
