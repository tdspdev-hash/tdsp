/**
 * Database types for the live TDSP Supabase project, public schema.
 *
 * Derived from the live schema (migration 0001_identity, verified 20 Nov 2026)
 * and written in the shape of `supabase gen types typescript`. Regenerate or
 * update this file after every migration; never edit it to disagree with the
 * database. The `private` schema is intentionally absent (not exposed to the API).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          details: Json;
          entity_id: string | null;
          entity_type: string;
          id: number;
        };
        // No client write path exists (no INSERT grant); typed for completeness.
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          details?: Json;
          entity_id?: string | null;
          entity_type: string;
          id?: never;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          details?: Json;
          entity_id?: string | null;
          entity_type?: string;
          id?: never;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          consent_accepted_at: string | null;
          created_at: string;
          district: string | null;
          full_name: string;
          gender: string | null;
          id: string;
          occupation: string | null;
          participation_areas: string[];
          phone: string | null;
          region: string | null;
          updated_at: string;
          village: string | null;
          ward: string | null;
        };
        // Rows are created only by the sign-up trigger; clients have no INSERT grant.
        Insert: {
          consent_accepted_at?: string | null;
          created_at?: string;
          district?: string | null;
          full_name: string;
          gender?: string | null;
          id: string;
          occupation?: string | null;
          participation_areas?: string[];
          phone?: string | null;
          region?: string | null;
          updated_at?: string;
          village?: string | null;
          ward?: string | null;
        };
        // Clients may update only these nine descriptive columns (column-level grant).
        Update: {
          district?: string | null;
          full_name?: string;
          gender?: string | null;
          occupation?: string | null;
          participation_areas?: string[];
          phone?: string | null;
          region?: string | null;
          village?: string | null;
          ward?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          granted_at: string;
          granted_by: string | null;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        // Read-only for clients (no write grants).
        Insert: {
          granted_at?: string;
          granted_by?: string | null;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          granted_at?: string;
          granted_by?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      app_role: "staff" | "admin";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
