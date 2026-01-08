"use client"

import { updateUserRole } from '@/actions/auth';
import { Shield, UserCheck, Users } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

const UserUpdateRoleBtn = ({
    userId,
    currentRole,
    userName,
}: {
    userId: string;
    currentRole: string;
    userName: string;
}) => {

    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(currentRole)

    const handleRoleChange = async (e: any) => {
        const newRole = e.target.value;

        if (newRole === currentRole) return

        setLoading(true)
        const result = await updateUserRole(userId, newRole)
        if (result.success) {
            toast.success(`${userName} is now a ${newRole}`)
            window.location.reload();
        } else {
            toast.error('Failed to update role')
        }
        setLoading(false);
    }

    if (loading) {
        return <div className='text-green-500 text-[14px] font-bold'>Updating...</div>
    }

    return (
        <select name="user-role" id="user-role" disabled={loading} value={selectedRole} onChange={handleRoleChange} className='border p-2 rounded-md'>
            <option id="admin" value="ADMIN">
                Admin
            </option>
            <option id="tenant" value="TENANT">
                Tenant
            </option>
            <option id="guest" value="GUEST">
                Guest
            </option>
        </select>
    )
}

export default UserUpdateRoleBtn