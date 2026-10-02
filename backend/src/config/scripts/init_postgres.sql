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

-- bang outbox luu event cho background worker
create table if not exists outbox_events (
    event_id uuid primary key default gen_random_uuid(),
    aggregate_type varchar(50) not null,
    aggregate_id varchar(50) not null,
    event_type varchar(50) not null,
    payload jsonb not null,
    processed_status varchar(20) not null default 'PENDING',
    retry_count int default 0,
    created_at timestamptz default now(),
    processed_at timestamptz
);

-- partial index loc cac event dang pending
create index if not exists idx_outbox_pending on outbox_events(processed_status) where processed_status = 'PENDING';

-- bang luu hoa don vat dien tu
create table if not exists invoices (
    invoice_id uuid primary key default gen_random_uuid(),
    order_code varchar(50) not null,
    customer_name varchar(100) not null,
    tax_code varchar(50),
    company_name varchar(200),
    total_amount numeric(15,2) not null,
    vat_amount numeric(15,2) not null,
    grand_total numeric(15,2) not null,
    status varchar(20) not null default 'ISSUED',
    created_at timestamptz default now()
);
