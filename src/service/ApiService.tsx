import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    static BASE_URL = "http://localhost:8080/api";
    static ENCRYPTION_KEY = "lephat-dev-system";
    // encrypt data using cryptoJs
    static encrypt(data: string): string {
        return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
    }
    // decrypt data using cryptoJs
    static decrypt(data: string): string {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // save token with encryption
    static saveToken(token: string): void {
        const encryptToken = this.encrypt(token);
        localStorage.setItem("token", encryptToken);
    }
    // retreive the token
    static getToken(): string | null {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }
    // save role with encryption
    static saveRole(role: string): void {
        const encryptRole = this.encrypt(role);
        localStorage.setItem("role", encryptRole);
    }
    // retreive the role
    static getRole(): string | null {
        const encryptedRole = localStorage.getItem("role");
        if (!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    static clearAuth(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static getHeader(): Record<string, string> {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    /** AUTH && USERS API */
    static async registerUser(registerData: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData);
        return response.data;
    }

    static async loginUser(loginUser: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginUser);
        return response.data;
    }

    static async getAllUsers(): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getLoggedInUser(): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/users/current`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getUserById(userId: number): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/users/transaction/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async uploadUserById(userId: number, userData: any): Promise<any> {
        const response = await axios.put(`${this.BASE_URL}/user/update/${userId}`, userData, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteUser(userId: number): Promise<any> {
        const response = await axios.delete(`${this.BASE_URL}/user/delete/${userId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**PRODUCT ENDPOINTS */
    static async addProduct(formData: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/product/add`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async getAllProduct(): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/product/all/`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getProductById(productId: number): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/products/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateProduct(formData: any): Promise<any> {
        const response = await axios.put(`${this.BASE_URL}/product/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async searchProduct(searchValue: string): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/products/search}`, {
            headers: this.getHeader(),
            params: { searchValue }
        });
        return response.data;
    }

    static async removeProduct(productId: number): Promise<any> {
        const response = await axios.delete(`${this.BASE_URL}/products/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**CATEGORY ENDPOINTS */

    static async createCategory(category: object): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/categories/add`, category, {
            headers: this.getHeader()

        });
        return response.data;
    }

    static async getAllCategories(): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/categories/all`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getCategoryById(categoryId: number): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/categories/${categoryId}/`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateCategory(categoryId: number, categoryData: object): Promise<any> {
        const response = await axios.put(`${this.BASE_URL}/categories/update/${categoryId}`, categoryData, {
            headers: this.getHeader()

        });
        return response.data;
    }

    static async deleteCategory(categoryId: number): Promise<any> {
        const response = await axios.delete(`${this.BASE_URL}/categories/${categoryId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**SUPPLIER ENDPOINT */

    static async addSupplier(supplierData: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/suppliers/add`, supplierData, {
            headers: this.getHeader()

        });
        return response.data;
    }

    static async getAllSuppliers(): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/suppliers/all/`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getSupplierById(supplierId: number): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/suppliers/${supplierId}/`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async updateSupplier(supplierId: number, supplierData: any): Promise<any> {
        const response = await axios.put(`${this.BASE_URL}/suppliers/update/${supplierId}`, supplierData, {
            headers: this.getHeader()

        });
        return response.data;
    }

    static async deleteSupplier(supplierId: number): Promise<any> {
        const response = await axios.delete(`${this.BASE_URL}/suppliers/${supplierId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**TRANSACTION ENDPOINT */

    static async purchaseStock(purchaseData: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/transactions/purchase`, purchaseData, {
            headers: this.getHeader()

        });
        return response.data;
    }

    static async sellProduct(sellData: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/transactions/sell/`, sellData,{
            headers: this.getHeader()
        });
        return response.data;
    }

    static async returnToSupplier(returnData: any): Promise<any> {
        const response = await axios.post(`${this.BASE_URL}/transactions/return/`, returnData, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getAllTransactions(): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/transactions/all/`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getTransactionById(transactionId: number): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/transactions/${transactionId}/`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getTransactionsByMonthAndYear(month: number, year: number): Promise<any> {
        const response = await axios.get(`${this.BASE_URL}/transactions/by-month-year`, {
            headers: this.getHeader(),
            params: {
                month: month,
                year: year
            }

        });
        return response.data;
    }

    static async updateTransactionStatus(transactionId: number, status: string): Promise<any> {
        const response = await axios.put(`${this.BASE_URL}/transactions/${transactionId}`, status, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**AUTHENTICATION CHECKER */
    static logout(): void {
        this.clearAuth();
    }
    static isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }
    static isAdmin(): boolean {
        const role = this.getRole();
        return role === "ADMIN";
    }
}

