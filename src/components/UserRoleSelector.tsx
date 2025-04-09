
import React from 'react';
import { UserRole } from '../types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserCog, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface UserRoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const handleRoleChange = (role: UserRole) => {
    onRoleChange(role);
    toast.success(`Switched to ${role} view`);
  };
  
  return (
    <Tabs defaultValue={currentRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
      <TabsList className="grid grid-cols-3 w-[400px]">
        <TabsTrigger value="Law Partner" className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4" />
          <span>Law Partner</span>
        </TabsTrigger>
        <TabsTrigger value="Attorney" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Attorney</span>
        </TabsTrigger>
        <TabsTrigger value="Operations Manager" className="flex items-center space-x-2">
          <UserCog className="h-4 w-4" />
          <span>Operations Manager</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default UserRoleSelector;
