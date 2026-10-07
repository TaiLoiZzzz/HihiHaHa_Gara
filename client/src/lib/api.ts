const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
  roleFallback?: string;
}

// Lưu trữ token theo vai trò
export async function getValidToken(role: string = "SERVICE_ADVISOR"): Promise<string> {
  if (typeof window === "undefined") return "";

  const storageKey = `hihihaha_token_${role.toLowerCase()}`;
  const cached = localStorage.getItem(storageKey);
  if (cached) return cached;

  try {
    const phoneMap: Record<string, string> = {
      CUSTOMER: "0908888888",
      SERVICE_ADVISOR: "0901000001",
      WORKSHOP_MANAGER: "0901000002",
      TECHNICIAN: "0901000003",
      OWNER: "0901000004",
    };

    const res = await fetch(`${API_BASE_URL}/auth/dev-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        phone: phoneMap[role] || "0901000001",
      }),
    });

    const data = await res.json();
    if (data?.data?.accessToken) {
      localStorage.setItem(storageKey, data.data.accessToken);
      localStorage.setItem("hihihaha_active_token", data.data.accessToken);
      return data.data.accessToken;
    }
  } catch (err) {
    console.warn("Lỗi khi xin dev token tự động:", err);
  }

  return "";
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, roleFallback = "SERVICE_ADVISOR", headers, ...rest } = options;

  let activeToken = token;
  if (!activeToken && typeof window !== "undefined") {
    activeToken =
      localStorage.getItem("hihihaha_active_token") ||
      (await getValidToken(roleFallback));
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

// Các hàm chuyên dụng gọi API dữ liệu thật
export const api = {
  // 1. Lấy thông tin Lệnh sửa chữa thật
  getWorkOrder: (orderCode: string) =>
    fetchApi<{ success: boolean; data: any }>(`/work-orders/${orderCode}`, {
      roleFallback: "CUSTOMER",
    }),

  // 2. Lấy danh sách Lệnh của tôi
  getMyWorkOrders: () =>
    fetchApi<{ success: boolean; data: any[] }>(`/work-orders/my-orders`, {
      roleFallback: "SERVICE_ADVISOR",
    }),

  // 3. Lấy kho 500 phụ tùng OEM thật
  getInventory: (limit = 100, page = 1) =>
    fetchApi<{ success: boolean; data: any }>(`/inventory?limit=${limit}&page=${page}`, {
      roleFallback: "WORKSHOP_MANAGER",
    }),

  // 4. Tạo URL thanh toán VNPay thật
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

  // 5. Cập nhật tiến độ & ảnh nghiệm thu của thợ
  updateProgress: (orderCode: string, payload: { stage?: string; note?: string; photo_url?: string; caption?: string }) =>
    fetchApi<{ success: boolean; data: any }>(`/work-orders/${orderCode}/progress`, {
      method: "POST",
      roleFallback: "TECHNICIAN",
      body: JSON.stringify(payload),
    }),

  // 6. Chẩn đoán AI Graph-RAG Gemini
  diagnoseAI: (vehicleModel: string, symptoms: string) =>
    fetchApi<{ success: boolean; data: any }>(`/ai/diagnose`, {
      method: "POST",
      body: JSON.stringify({ vehicle_model: vehicleModel, symptoms }),
    }),

  // 7. Lấy token xác thực theo vai trò
  getValidToken,
};

export default api;
