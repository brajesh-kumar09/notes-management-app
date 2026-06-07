import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (data) =>
    axios.post(`${API_URL}/api/auth/login`, data);

export const registerUser = async (data) =>
    axios.post(`${API_URL}/api/auth/register`, data);

export const deleteUserAccount = async (token) =>
    axios.post(`${API_URL}/api/auth/delete-account`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    })

export const getNotes = async (token) =>
    axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const createNote = async (data, token) =>
    axios.post(`${API_URL}/api/notes`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const updateNote = async (id, data, token) =>
    axios.put(`${API_URL}/api/notes/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteNote = async (id, token) =>
    axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });