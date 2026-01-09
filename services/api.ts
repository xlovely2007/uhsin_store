
const RENDER_BASE_URL = 'https://uhsin-store-api.onrender.com/api';

class ApiService {
  private getHeaders() {
    const token = localStorage.getItem('uhsin_jwt');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${RENDER_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('uhsin_jwt');
          window.dispatchEvent(new Event('unauthorized'));
        }
        throw new Error(`Backend Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Call failed: ${url}`, error);
      throw error;
    }
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint, { method: 'GET' }); }
  post<T>(endpoint: string, body: any) { return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put<T>(endpoint: string, body: any) { return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiService();
