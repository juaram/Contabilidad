CREATE TABLE IF NOT EXISTS conta_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(255) NOT NULL DEFAULT 'category',
    color_bg VARCHAR(50) NOT NULL DEFAULT 'bg-primary-fixed',
    color_text VARCHAR(50) NOT NULL DEFAULT 'text-on-primary-fixed',
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conta_subcategories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES conta_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conta_movements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    subcategory_id INT UNSIGNED DEFAULT NULL,
    description VARCHAR(255) NOT NULL,
    type ENUM('ingreso','gasto') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES conta_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (subcategory_id) REFERENCES conta_subcategories(id) ON DELETE SET NULL,
    INDEX idx_date_type (date, type),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conta_preferences (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    currency VARCHAR(20) NOT NULL DEFAULT 'Euro (€) - EUR',
    date_format VARCHAR(40) NOT NULL DEFAULT 'DD / MM / AAAA (31/12/2024)',
    high_contrast TINYINT(1) NOT NULL DEFAULT 0,
    app_title VARCHAR(100) NOT NULL DEFAULT 'Mis Cuentas',
    app_subtitle VARCHAR(200) NOT NULL DEFAULT 'Control Financiero',
    list_font VARCHAR(20) NOT NULL DEFAULT 'sans',
    multi_registro TINYINT(1) NOT NULL DEFAULT 1,
    dropdown_bg VARCHAR(20) NOT NULL DEFAULT '#bfdbfe',
    dropdown_border VARCHAR(20) NOT NULL DEFAULT '#93c5fd',
    dropdown_border_width INT NOT NULL DEFAULT 2,
    dropdown_radius INT NOT NULL DEFAULT 12,
    dropdown_text_color VARCHAR(20) NOT NULL DEFAULT '#1f2937',
    dropdown_row_height INT NOT NULL DEFAULT 44,
    show_description TINYINT(1) NOT NULL DEFAULT 1,
    show_balance TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO conta_preferences (id, currency, date_format, high_contrast, app_title, app_subtitle) VALUES (1, 'Euro (€) - EUR', 'DD / MM / AAAA (31/12/2024)', 0, 'Mis Cuentas', 'Control Financiero')
ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS conta_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    totp_enabled TINYINT(1) NOT NULL DEFAULT 0,
    totp_secret VARCHAR(64) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO conta_users (username, password_hash) VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username=username;
