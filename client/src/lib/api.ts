const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface UserSession {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: "CUSTOMER" | "SERVICE_ADVISOR" | "WORKSHOP_MANAGER" | "TECHNICIAN" | "OWNER" | string;
  license_plate?: string;
  vip_rank?: string;
}

export interface FetchOptions extends RequestInit {
  token?: string;
  roleFallback?: string;
}

// Lưu session người dùng sau khi đăng nhập thành công
export function saveSession(token: string, user: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("hihihaha_token", token);
  localStorage.setItem("hihihaha_user", JSON.stringify(user));
}

// Lấy thông tin user hiện tại từ session
export function getCurrentUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("hihihaha_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

// Lấy token đã lưu trong phiên làm việc
export function getSavedToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("hihihaha_token") || "";
}

// Xóa phiên làm việc khi đăng xuất
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hihihaha_token");
  localStorage.removeItem("hihihaha_user");
}

// Lấy token hợp lệ (ưu tiên token đã đăng nhập trong localStorage)
export async function getValidToken(roleFallback: string = "SERVICE_ADVISOR"): Promise<string> {
  if (typeof window === "undefined") return "";

  const saved = getSavedToken();
  if (saved) return saved;

  // Nếu chưa đăng nhập, cấp token theo role để tránh đứt kết nối
  try {
    const phoneMap: Record<string, string> = {
      CUSTOMER: "0912345678",
      SERVICE_ADVISOR: "0988888801",
      WORKSHOP_MANAGER: "0988888802",
      TECHNICIAN: "0988888803",
      OWNER: "0988888800",
    };

    const res = await fetch(`${API_BASE_URL}/auth/dev-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: roleFallback,
        phone_number: phoneMap[roleFallback] || "0988888801",
      }),
    });

    const data = await res.json();
    if (data?.data?.accessToken) {
      saveSession(data.data.accessToken, data.data.user);
      return data.data.accessToken;
    }
  } catch (err) {
    console.warn("Lỗi xác thực:", err);
  }

  return "";
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, roleFallback = "SERVICE_ADVISOR", headers, ...rest } = options;

  let activeToken = token;
  if (!activeToken && typeof window !== "undefined") {
    activeToken = getSavedToken() || (await getValidToken(roleFallback));
  }

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (activeToken) {
    reqHeaders["Authorization"] = `Bearer ${activeToken}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    headers: reqHeaders,
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Lỗi API: ${response.status}`);
  }

  return data;
}

// Các hàm nghiệp vụ gọi Backend API thật
export const api = {
  // 1. Đăng nhập nhân viên nội bộ thật (SĐT + Mật khẩu)
  staffLogin: async (phone_number: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/staff-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập nhân viên không thành công");
    }
    if (data.data?.accessToken && data.data?.user) {
      saveSession(data.data.accessToken, data.data.user);
    }
    return data;
  },

  // 2. Yêu cầu mã OTP cho khách hàng
  requestOtp: async (phone_number: string, license_plate: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, license_plate }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Không thể gửi OTP");
    }
    return data;
  },

  // 3. Xác thực OTP và đăng nhập khách hàng thật
  verifyOtp: async (phone_number: string, license_plate: string, otp_code: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, license_plate, otp_code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Mã OTP không hợp lệ");
    }
    if (data.data?.accessToken && data.data?.user) {
      saveSession(data.data.accessToken, data.data.user);
    }
    return data;
  },

  // 4. Lấy thông tin Lệnh sửa chữa thật
  getWorkOrder: (orderCode: string) =>
    fetchApi<{ success: boolean; data: any }>(`/work-orders/${orderCode}`, {
      roleFallback: "CUSTOMER",
    }),

  // 5. Lấy danh sách Lệnh của tôi
  getMyWorkOrders: () =>
    fetchApi<{ success: boolean; data: any[] }>(`/work-orders/my-orders`, {
      roleFallback: "SERVICE_ADVISOR",
    }),

  // 6. Lấy kho phụ tùng OEM có hỗ trợ phân trang & tìm kiếm
  getInventory: (limit = 15, page = 1, category?: string, search?: string) => {
    let url = `/inventory?limit=${limit}&page=${page}`;
    if (category && category !== "all") url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return fetchApi<{ success: boolean; data: any }>(url, {
      roleFallback: "WORKSHOP_MANAGER",
    });
  },

  // 7. Tạo URL thanh toán VNPay Sandbox thật
  createPaymentUrl: (orderCode: string, bankCode?: string) =>
    fetchApi<{
      success: boolean;
      data: {
        payment_url: string;
        order_code: string;
        amount: number;
        transaction_id: string;
      };
    }>(`/payments/create-payment-url`, {
      method: "POST",
      roleFallback: "CUSTOMER",
      body: JSON.stringify({ order_code: orderCode, bank_code: bankCode }),
    }),

  // 8. Cập nhật tiến độ & ảnh nghiệm thu của thợ
  updateProgress: (orderCode: string, payload: { stage?: string; note?: string; photo_url?: string; caption?: string }) =>
    fetchApi<{ success: boolean; data: any }>(`/work-orders/${orderCode}/progress`, {
      method: "POST",
      roleFallback: "TECHNICIAN",
      body: JSON.stringify(payload),
    }),

  // 9. Chẩn đoán AI Graph-RAG Gemini
  diagnoseAI: (vehicleModel: string, symptoms: string) =>
    fetchApi<{ success: boolean; data: any }>(`/ai/diagnose`, {
      method: "POST",
      body: JSON.stringify({ vehicle_model: vehicleModel, symptoms }),
    }),

  // 10. Quản lý phiên làm việc
  getValidToken,
  getCurrentUser,
  clearSession,
};

export default api;
