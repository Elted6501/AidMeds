import { createPool } from "mysql";
import { promisify } from "util";

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aidmeds"
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) {
        connection.release();
        console.log('DATABASE CONNECTION WAS ACCEPTED');
    } else {
        console.log('DATABASE IS NOT CONNECTED');
    }
});

// to soport promises / Callback code to Promise Code
pool.query = promisify(pool.query);

export default pool;