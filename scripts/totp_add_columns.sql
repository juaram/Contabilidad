-- Migración para verificación en dos pasos (2FA / TOTP) en conta_users
-- Ejecutar una sola vez sobre la base de datos real (Hostalia).

ALTER TABLE conta_users
    ADD COLUMN totp_enabled TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN totp_secret VARCHAR(64) DEFAULT NULL;