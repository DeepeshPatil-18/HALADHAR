-- ============================================================
-- HALADHAR Blackout Resilience — Schema Migration
-- Creates the 5 recovery tables required for the Blackout demo.
-- Run AFTER migrations 001–005.
-- ============================================================

-- ============================================================
-- 1. advisory_snapshots
--    Versioned snapshots of important advisories.
--    Created every time an advisory is successfully saved.
-- ============================================================
CREATE TABLE IF NOT EXISTS advisory_snapshots (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  advisory_id  text        NOT NULL,
  farmer_id    text        NOT NULL,
  content      text        NOT NULL,
  version      integer     NOT NULL DEFAULT 1,
  checksum     text        NOT NULL,   -- SHA-256 hex of content
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_adv_snapshots_advisory  ON advisory_snapshots(advisory_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_adv_snapshots_farmer    ON advisory_snapshots(farmer_id, created_at DESC);

ALTER TABLE advisory_snapshots ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own snapshots
CREATE POLICY "adv_snapshots_select_own" ON advisory_snapshots
  FOR SELECT USING (farmer_id = auth.uid()::text OR auth.role() = 'service_role');

-- Only backend service role can write
CREATE POLICY "adv_snapshots_insert" ON advisory_snapshots
  FOR INSERT WITH CHECK (true);  -- frontend writes during demo; tighten in production


-- ============================================================
-- 2. advisory_events
--    Append-only event log for all advisory operations.
--    Used for event-sourcing recovery (Tier 4).
-- ============================================================
CREATE TABLE IF NOT EXISTS advisory_events (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id text        NOT NULL UNIQUE,  -- idempotency key
  advisory_id  text        NOT NULL,
  farmer_id    text        NOT NULL,
  event_type   text        NOT NULL CHECK (event_type IN ('CREATED','UPDATED','DELETED','RECOVERED')),
  payload      jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_adv_events_advisory   ON advisory_events(advisory_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adv_events_operation  ON advisory_events(operation_id);
CREATE INDEX IF NOT EXISTS idx_adv_events_farmer     ON advisory_events(farmer_id, created_at DESC);

ALTER TABLE advisory_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "adv_events_select_own" ON advisory_events
  FOR SELECT USING (farmer_id = auth.uid()::text OR auth.role() = 'service_role');

CREATE POLICY "adv_events_insert" ON advisory_events
  FOR INSERT WITH CHECK (true);  -- tighten in production


-- ============================================================
-- 3. pending_operations
--    Queue of write operations that could not complete due to
--    Supabase being unavailable. Retried when DB comes back.
-- ============================================================
CREATE TABLE IF NOT EXISTS pending_operations (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id   text        NOT NULL UNIQUE,
  operation_type text        NOT NULL,
  payload        jsonb       NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now(),
  retry_count    integer     NOT NULL DEFAULT 0,
  status         text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed'))
);

CREATE INDEX IF NOT EXISTS idx_pending_ops_status  ON pending_operations(status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_pending_ops_op_id   ON pending_operations(operation_id);

ALTER TABLE pending_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_ops_select" ON pending_operations
  FOR SELECT USING (true);  -- recovery dashboard needs to read all

CREATE POLICY "pending_ops_insert" ON pending_operations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "pending_ops_update" ON pending_operations
  FOR UPDATE USING (true);


-- ============================================================
-- 4. recovery_log
--    Audit log of recovery events (BLACKOUT_DETECTED,
--    RECOVERY_STARTED, RECOVERY_COMPLETED, SYNC_COMPLETED).
-- ============================================================
CREATE TABLE IF NOT EXISTS recovery_log (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type            text        NOT NULL
    CHECK (event_type IN ('BLACKOUT_DETECTED','RECOVERY_STARTED','RECOVERY_COMPLETED','SYNC_COMPLETED')),
  records_affected      integer     NOT NULL DEFAULT 0,
  records_recovered     integer     NOT NULL DEFAULT 0,
  records_unrecoverable integer     NOT NULL DEFAULT 0,
  details               jsonb       NOT NULL DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recovery_log_created ON recovery_log(created_at DESC);

ALTER TABLE recovery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recovery_log_select" ON recovery_log
  FOR SELECT USING (true);

CREATE POLICY "recovery_log_insert" ON recovery_log
  FOR INSERT WITH CHECK (true);


-- ============================================================
-- 5. blackout_demo_records
--    Safe sandbox for Blackout simulation — only these records
--    are modified during the demo. Real farmer data is never touched.
-- ============================================================
CREATE TABLE IF NOT EXISTS blackout_demo_records (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_name  text        NOT NULL,
  crop         text        NOT NULL,
  advisory     text        NOT NULL DEFAULT '',
  status       text        NOT NULL DEFAULT 'VERIFIED'
    CHECK (status IN ('VERIFIED','RECOVERED','PENDING','UNAVAILABLE','CORRUPTED')),
  version      integer     NOT NULL DEFAULT 1,
  checksum     text        NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER blackout_demo_updated_at
  BEFORE UPDATE ON blackout_demo_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_blackout_demo_status ON blackout_demo_records(status);

ALTER TABLE blackout_demo_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blackout_demo_select" ON blackout_demo_records
  FOR SELECT USING (true);

CREATE POLICY "blackout_demo_insert" ON blackout_demo_records
  FOR INSERT WITH CHECK (true);

CREATE POLICY "blackout_demo_update" ON blackout_demo_records
  FOR UPDATE USING (true);

-- ============================================================
-- Seed 3 demo records
-- ============================================================
INSERT INTO blackout_demo_records (farmer_name, crop, advisory, status, version, checksum) VALUES
  ('Ramesh Patil',   'Soybean',  'आज पाणी देऊ नका. उद्या संध्याकाळी पुन्हा तपासा.',                     'VERIFIED',   1, 'a1b2c3d4'),
  ('Sunita Jadhav',  'Onion',    'कांद्याच्या शेतात बुरशीनाशक फवारणी करा. पाऊस येण्यापूर्वी पूर्ण करा.', 'VERIFIED',   1, 'b2c3d4e5'),
  ('Vijay Shinde',   'Cotton',   'बोंड अळीसाठी फेरोमोन सापळे लावा. आठवड्यात तपासा.',                    'VERIFIED',   1, 'c3d4e5f6');
