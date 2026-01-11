
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:5000/api/auth';

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    avatar?: string;
}


export const authService = {
    login: async (email: string, password: string) => {
        const { data } = await axios.post<any>(`${API_URL}/login`, { email, password });

        if (data.token) {
            localStorage.setItem('token', data.token);

            const user: User = {
                id: data._id,
                username: data.username,
                email: data.email,
                role: data.role,
                avatar: data.avatar
            };

            localStorage.setItem('user', JSON.stringify(user));
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr || userStr === 'undefined') return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            localStorage.removeItem('user');
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAdmin: (): boolean => {
        const user = authService.getCurrentUser();
        return user?.role === 'admin';
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                authService.logout();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
};
