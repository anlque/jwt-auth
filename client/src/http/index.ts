import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";


export const API_URL = 'http://localhost:5001/api';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalReq = error.config;
    if(error.response.status === 401 && error.config && !originalReq._isRetry) {
        try{
            originalReq._isRetry = true;
            const res = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', res.data.accessToken);
            return $api.request(originalReq)
        }
        catch(error) {
            console.log('The user is not authorized');
        }
    }
    throw error;
})

export default $api;