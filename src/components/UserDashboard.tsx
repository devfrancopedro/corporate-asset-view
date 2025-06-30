
import React from 'react';
import { User } from '@supabase/supabase-js';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardStats } from './dashboard/DashboardStats';
import { MaintenanceHistory } from './dashboard/MaintenanceHistory';
import { mockMaintenances } from '@/types/maintenance';

interface UserDashboardProps {
  user: User;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  // Get user display name from user metadata or email
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader userName={userName} />
      <DashboardStats maintenances={mockMaintenances} />
      <MaintenanceHistory maintenances={mockMaintenances} />
    </div>
  );
};
