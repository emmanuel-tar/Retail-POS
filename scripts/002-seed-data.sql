-- Insert default users
INSERT INTO users (user_id, name, email, password_hash, role, permissions) VALUES
('MGR001', 'John Manager', 'manager@pos.com', '$2b$10$rQZ8kHWiZ8.vKxF5vKxF5O8vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5O', 'manager', 
 ARRAY['sales', 'inventory', 'purchase', 'reports', 'user_management', 'settings', 'price_override', 'discount_approval', 'void_transactions', 'cash_management', 'supplier_management', 'customer_management', 'adjustments', 'export_reports']),
('SUP001', 'Jane Supervisor', 'supervisor@pos.com', '$2b$10$rQZ8kHWiZ8.vKxF5vKxF5O8vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5O', 'supervisor',
 ARRAY['sales', 'inventory', 'reports', 'price_override', 'discount_approval', 'cash_management', 'adjustments', 'export_reports']),
('SEL001', 'Bob Seller', 'seller@pos.com', '$2b$10$rQZ8kHWiZ8.vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5O', 'seller',
 ARRAY['sales', 'inventory']),
('SEL002', 'Alice Seller', 'alice@pos.com', '$2b$10$rQZ8kHWiZ8.vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5vKxF5O', 'seller',
 ARRAY['sales', 'inventory'])
ON CONFLICT (user_id) DO NOTHING;

-- Insert default suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address, rating) VALUES
('ABC Suppliers Ltd', 'John Smith', '+234 123 456 7890', 'contact@abcsuppliers.com', '123 Main Street, Lagos, Nigeria', 4),
('XYZ Trading Co', 'Jane Doe', '+234 987 654 3210', 'info@xyztrading.com', '456 Market Road, Abuja, Nigeria', 3),
('Global Imports Inc', 'Michael Johnson', '+234 555 123 4567', 'sales@globalimports.com', '789 Harbor Avenue, Port Harcourt, Nigeria', 2),
('Local Distributors', 'Sarah Williams', '+234 111 222 3333', 'info@localdistributors.com', '321 Village Road, Kano, Nigeria', 5)
ON CONFLICT DO NOTHING;

-- Insert default products
INSERT INTO products (name, barcode, price, cost, stock, min_stock, category, supplier_id) VALUES
('Coca Cola 500ml', '123456789', 2.50, 1.80, 50, 20, 'Beverages', 1),
('Bread Loaf', '987654321', 3.25, 2.00, 25, 10, 'Bakery', 2),
('Milk 1L', '456789123', 4.75, 3.50, 30, 15, 'Dairy', 1),
('Bananas (1kg)', '789123456', 2.99, 2.00, 40, 20, 'Fruits', 3),
('Chicken Breast (1kg)', '321654987', 12.99, 9.50, 15, 5, 'Meat', 4),
('Rice (2kg)', '654987321', 8.50, 6.00, 20, 10, 'Grains', 2),
('Indomie Noodles', '111222333', 1.50, 1.00, 100, 25, 'Food', 2),
('Peak Milk 400g', '444555666', 8.00, 6.00, 25, 10, 'Dairy', 1),
('Cooking Oil 1L', '777888999', 12.00, 9.00, 40, 15, 'Cooking', 3),
('Sugar 1kg', '000111222', 3.50, 2.50, 35, 15, 'Cooking', 4)
ON CONFLICT (barcode) DO NOTHING;
