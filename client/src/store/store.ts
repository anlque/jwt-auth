import {makeAutoObservable} from "mobx";
import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    async login(email: string, password: string) {
        try {
            const res = await AuthService.login(email, password);
            localStorage.setItem('token', res.data.accessToken)
            this.setAuth(true);
            this.setUser(res.data.user);
        }
        catch(e: any){
            console.log(e.response?.data?.message);
        }
    }
    async registration(email: string, password: string) {
        try {
            const res = await AuthService.registration(email, password);
            localStorage.setItem('token', res.data.accessToken)
            this.setAuth(true);
            this.setUser(res.data.user);
        }
        catch(e: any){
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token')
            this.setAuth(false);
            this.setUser({} as IUser);
        }
        catch(e: any){
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth(){
        try{
            this.setLoading(true);
            const res = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', res.data.accessToken)
            this.setAuth(true);
            this.setUser(res.data.user);
        }
        catch(e: any){
            console.log(e.response?.data?.message);
        }
        finally {
            this.setLoading(false);
        }
    }
}