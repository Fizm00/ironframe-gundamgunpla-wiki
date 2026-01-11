import api from '@/lib/api';

const API_URL = '/users';

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    avatar?: string;
    createdAt?: string;
}

const getAll = async (params?: { search?: string }) => {
    const response = await api.get<User[]>(API_URL, { params });
    return response.data;
};

const updateRole = async (id: string, role: 'user' | 'admin') => {
    const response = await api.put<User>(`${API_URL}/${id}/role`, { role });
    return response.data;
};

const deleteUser = async (id: string) => {
    const response = await api.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
};

export const userService = {
    getAll,
    updateRole,
    delete: deleteUser
};
