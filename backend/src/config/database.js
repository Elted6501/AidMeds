import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'aidmeds',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

// Override query method to return rows directly (compatible with existing code)
const originalQuery = pool.query.bind(pool);
const originalExecute = pool.execute.bind(pool);

pool.query = async function(sql, params) {
    const [rows] = await originalExecute(sql, params);
    return rows;
};

export default pool;
