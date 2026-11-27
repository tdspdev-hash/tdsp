/**
 * Database types for the live TDSP Supabase project, public schema.
 *
 * Derived from the live schema (migrations 0001_identity and 0004_projects, verified 20 Nov 2026)
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
      // memberships and membership_applications: from migration 0002, PREPARED, NOT APPLIED.
      // Only the columns the app reads. No client write path exists.
      membership_applications: {
        Row: {
          created_at: string;
          id: string;
          requested_category: "kawaida" | "hai" | "premium";
          user_id: string | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      memberships: {
        Row: {
          application_id: string;
          approved_at: string;
          member_number: string;
          status: "active" | "suspended" | "ended";
          user_id: string | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      project_admin: {
        Row: {
          created_at: string;
          created_by: string | null;
          internal_note: string | null;
          owner_id: string | null;
          project_id: string;
          updated_at: string;
        };
        // Staff-only. Clients may write only owner_id and internal_note (column grants).
        Insert: {
          created_at?: string;
          created_by?: string | null;
          internal_note?: string | null;
          owner_id?: string | null;
          project_id: string;
          updated_at?: string;
        };
        Update: {
          internal_note?: string | null;
          owner_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_admin_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: true;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_documents: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          project_id: string;
          storage_path: string;
          title_en: string;
          title_sw: string;
          visibility: "public" | "staff";
        };
        Insert: {
          project_id: string;
          storage_path: string;
          title_en: string;
          title_sw: string;
          visibility?: "public" | "staff";
        };
        Update: {
          storage_path?: string;
          title_en?: string;
          title_sw?: string;
          visibility?: "public" | "staff";
        };
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          category: string | null;
          cover_image_path: string | null;
          created_at: string;
          description_en: string;
          description_sw: string;
          end_date: string | null;
          id: string;
          is_sample: boolean;
          location: string | null;
          objectives_en: string | null;
          objectives_sw: string | null;
          period_label: string | null;
          project_number: number;
          publication_status: "draft" | "published" | "archived";
          published_at: string | null;
          slug: string;
          start_date: string | null;
          status: "planned" | "ongoing" | "completed" | "cancelled";
          summary_en: string;
          summary_sw: string;
          target_group_en: string | null;
          target_group_sw: string | null;
          title_en: string;
          title_sw: string;
          updated_at: string;
        };
        // id, project_number, created_at and updated_at are set by the database.
        Insert: {
          category?: string | null;
          cover_image_path?: string | null;
          description_en: string;
          description_sw: string;
          end_date?: string | null;
          is_sample?: boolean;
          location?: string | null;
          objectives_en?: string | null;
          objectives_sw?: string | null;
          period_label?: string | null;
          publication_status?: "draft" | "published" | "archived";
          published_at?: string | null;
          slug: string;
          start_date?: string | null;
          status?: "planned" | "ongoing" | "completed" | "cancelled";
          summary_en: string;
          summary_sw: string;
          target_group_en?: string | null;
          target_group_sw?: string | null;
          title_en: string;
          title_sw: string;
        };
        Update: {
          category?: string | null;
          cover_image_path?: string | null;
          description_en?: string;
          description_sw?: string;
          end_date?: string | null;
          is_sample?: boolean;
          location?: string | null;
          objectives_en?: string | null;
          objectives_sw?: string | null;
          period_label?: string | null;
          publication_status?: "draft" | "published" | "archived";
          published_at?: string | null;
          slug?: string;
          start_date?: string | null;
          status?: "planned" | "ongoing" | "completed" | "cancelled";
          summary_en?: string;
          summary_sw?: string;
          target_group_en?: string | null;
          target_group_sw?: string | null;
          title_en?: string;
          title_sw?: string;
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
