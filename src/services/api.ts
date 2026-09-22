/**
 * TSFMS Frontend API Service Layer
 * Communicates with FastAPI backend at VITE_API_BASE_URL (defaults to http://localhost:8000/api)
 * Note: MongoDB credentials must NEVER be stored or exposed in this frontend layer.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('tsfms_auth_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('tsfms_auth_token', token);
    } else {
      localStorage.removeItem('tsfms_auth_token');
    }
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem('tsfms_auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch (_) {
        // Fallback to generic message
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  // System Health
  public async checkHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  public async checkDbHealth(): Promise<{ status: string; database?: string; message?: string }> {
    return this.request<{ status: string; database?: string; message?: string }>('/health/db');
  }

  // Authentication
  public async register(data: { name: string; email: string; phone: string; password: string }) {
    const res = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  public async login(credentials: { email: string; password: string }) {
    const res = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  public async getProfile() {
    return this.request<any>('/auth/me');
  }

  public logout() {
    this.setToken(null);
  }

  // Schemes
  public async getSchemes() {
    return this.request<any[]>('/schemes');
  }

  public async getSchemeById(id: string) {
    return this.request<any>(`/schemes/${id}`);
  }

  // Applications
  public async createApplication(payload: any) {
    return this.request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getMyApplications() {
    return this.request<any[]>('/applications/my');
  }

  public async getApplicationById(id: string) {
    return this.request<any>(`/applications/${id}`);
  }

  public async updateApplication(id: string, updates: any) {
    return this.request<any>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Documents
  public async uploadDocument(applicationId: string, documentType: string, file: File) {
    const formData = new FormData();
    formData.append('application_id', applicationId);
    formData.append('document_type', documentType);
    formData.append('file', file);

    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Document upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  public async getDocumentsByApplication(applicationId: string) {
    return this.request<any[]>(`/documents/application/${applicationId}`);
  }

  // Grievances
  public async lodgeGrievance(data: { applicationId?: string; category: string; subject: string; description: string }) {
    return this.request<any>('/grievances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getMyGrievances() {
    return this.request<any[]>('/grievances/my');
  }
}

export const api = new ApiClient();
