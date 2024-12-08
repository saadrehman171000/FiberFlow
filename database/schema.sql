CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL,
    total REAL NOT NULL,
    notes TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    style TEXT NOT NULL,
    fabric TEXT NOT NULL,
    vendor TEXT NOT NULL,
    poDate TEXT NOT NULL,
    image BLOB,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS size_quantities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    size TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS representatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phoneNumber TEXT NOT NULL,
    whatsappNumber TEXT,
    address TEXT NOT NULL,
    cnicNumber TEXT NOT NULL UNIQUE,
    status TEXT CHECK(status IN ('active', 'inactive', 'none')) NOT NULL DEFAULT 'none',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    industry TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME
);