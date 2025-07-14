INSERT INTO users (user_id, name, email, role, permissions, password_hash, status)
VALUES
('MGR001', 'John Manager', 'manager@pos.com', 'manager', ARRAY['sales', 'inventory', 'purchase', 'reports', 'user_management', 'settings', 'price_override', 'discount_approval', 'void_transactions', 'cash_management', 'supplier_management', 'customer_management', 'adjustments', 'export_reports'], 'password123', 'active'),
('SUP001', 'Jane Supervisor', 'supervisor@pos.com', 'supervisor', ARRAY['sales', 'inventory', 'reports', 'price_override', 'discount_approval', 'cash_management', 'adjustments', 'export_reports'], 'password123', 'active'),
('SEL001', 'Bob Seller', 'seller@pos.com', 'seller', ARRAY['sales', 'inventory'], 'password123', 'active'),
('SEL002', 'Alice Seller', 'alice@pos.com', 'seller', ARRAY['sales', 'inventory'], 'password123', 'active');

INSERT INTO products (sku, name, description, price, cost, stock_quantity, category)
VALUES
('SKU001', 'Laptop Pro X', 'High-performance laptop', 1200.00, 800.00, 50, 'Electronics'),
('SKU002', 'Wireless Mouse', 'Ergonomic wireless mouse', 25.00, 10.00, 200, 'Accessories'),
('SKU003', 'Mechanical Keyboard', 'Gaming mechanical keyboard', 80.00, 40.00, 100, 'Accessories'),
('SKU004', 'USB-C Hub', 'Multi-port USB-C hub', 45.00, 20.00, 150, 'Accessories'),
('SKU005', 'External SSD 1TB', 'Portable 1TB SSD', 150.00, 90.00, 75, 'Storage');
