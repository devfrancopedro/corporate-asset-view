
import type { Database } from '@/integrations/supabase/types';

// Use the database types from Supabase
export type Equipment = Database['public']['Tables']['equipments']['Row'];
export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
export type Maintenance = Database['public']['Tables']['maintenances']['Row'];

// Create insert types that omit the auto-handled fields
export type EquipmentInsert = Omit<Database['public']['Tables']['equipments']['Insert'], 'created_by'>;
export type SupportTicketInsert = Omit<Database['public']['Tables']['support_tickets']['Insert'], 'created_by'>;
export type MaintenanceInsert = Omit<Database['public']['Tables']['maintenances']['Insert'], 'requested_by'>;
