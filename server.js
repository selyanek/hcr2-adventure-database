const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hcr2_db',
    password: '2006002',
    port: 5432,
});

app.get('/api/records', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.nameVehicle, m.nameMap, p.namePlayer, p.country, wr.distance, wr.current, 
                   v.idVehicle, m.idMap, p.idPlayer
            FROM WorldRecord wr
            JOIN Vehicle v ON wr.idVehicle = v.idVehicle
            JOIN Map m ON wr.idMap = m.idMap
            JOIN Player p ON wr.idPlayer = p.idPlayer
            ORDER BY wr.distance DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/filters', async (req, res) => {
    try {
        const vehicles = await pool.query('SELECT idVehicle, nameVehicle FROM Vehicle ORDER BY nameVehicle');
        const maps = await pool.query('SELECT idMap, nameMap FROM Map ORDER BY nameMap');
        const players = await pool.query('SELECT idPlayer, namePlayer, country FROM Player ORDER BY namePlayer');
        
        res.json({
            vehicles: vehicles.rows,
            maps: maps.rows,
            players: players.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));