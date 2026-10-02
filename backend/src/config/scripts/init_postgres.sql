-- tao extension uuid
create extension if not exists "pgcrypto";

-- bang luu lich su giao dich vnpay
create table if not exists payment_transactions (
    txn_id uuid primary key default gen_random_uuid(),
    order_code varchar(50) not null,
    vnp_txn_ref varchar(100) unique not null,
    vnp_bank_code varchar(20),
    amount numeric(15,2) not null default 2808000.00,
    status varchar(20) not null default 'PENDING',
    payment_link_expires_at timestamptz not null,
    created_at timestamptz default now(),
    completed_at timestamptz,

    -- check tien > 0 va trang thai hop le
    constraint chk_payment_amount check (amount > 0),
    constraint chk_payment_status check (status in ('PENDING', 'SUCCESS', 'FAILED', 'PAYMENT_EXPIRED'))
);
