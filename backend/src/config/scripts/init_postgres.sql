-- =============================================================================
-- SCRIPT KHỞI TẠO CSD TÀI CHÍNH POSTGRESQL (HIHIHAHA_AUTO)
-- Bước 31 -> 34: Kích hoạt pgcrypto extension & Bảng payment_transactions
-- =============================================================================

-- Bước 32: Kích hoạt tiện ích mở rộng pgcrypto để tự động sinh UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Bước 33 & 34: Tạo bảng payment_transactions kèm ràng buộc toàn vẹn dữ liệu
CREATE TABLE IF NOT EXISTS payment_transactions (
    txn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) NOT NULL,
    vnp_txn_ref VARCHAR(100) UNIQUE NOT NULL,
    vnp_bank_code VARCHAR(20),
    amount NUMERIC(15,2) NOT NULL DEFAULT 2808000.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_link_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Bước 34: Ràng buộc toàn vẹn giá trị tiền tệ hợp lệ (> 0) và trạng thái Enum
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'PAYMENT_EXPIRED'))
);
