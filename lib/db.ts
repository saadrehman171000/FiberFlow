// lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'database', 'data.db');
const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database with schema
try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executing schema:', schema);
    db.exec(schema);
} catch (error) {
    console.error('Error initializing database:', error);
}

export default db;