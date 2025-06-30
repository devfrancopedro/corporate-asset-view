
import { useEquipments } from './useEquipments';
import { useSupportTickets } from './useSupportTickets';
import { useMaintenances } from './useMaintenances';

// Export types for backward compatibility
export type { Equipment, SupportTicket, Maintenance } from '@/types/database';

export const useSupabaseData = () => {
  const equipmentHook = useEquipments();
  const supportTicketsHook = useSupportTickets();
  const maintenancesHook = useMaintenances();

  // Combine loading states - show loading if any of the hooks are loading
  const loading = equipmentHook.loading || supportTicketsHook.loading || maintenancesHook.loading;

  return {
    loading,
    // Equipment methods and data
    equipments: equipmentHook.equipments,
    fetchEquipments: equipmentHook.fetchEquipments,
    createEquipment: equipmentHook.createEquipment,
    updateEquipment: equipmentHook.updateEquipment,
    deleteEquipment: equipmentHook.deleteEquipment,
    // Support Tickets methods and data
    supportTickets: supportTicketsHook.supportTickets,
    fetchSupportTickets: supportTicketsHook.fetchSupportTickets,
    createSupportTicket: supportTicketsHook.createSupportTicket,
    updateSupportTicket: supportTicketsHook.updateSupportTicket,
    // Maintenances methods and data
    maintenances: maintenancesHook.maintenances,
    fetchMaintenances: maintenancesHook.fetchMaintenances,
    createMaintenance: maintenancesHook.createMaintenance,
    updateMaintenance: maintenancesHook.updateMaintenance,
  };
};
