import pool from '../config/database.js';

export const getAllMunicipios = async (req, res) => {
    try {
        const municipios = await pool.query('SELECT * FROM municipios ORDER BY nombre');

        res.json({
            success: true,
            count: municipios.length,
            municipios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener municipios',
            error: error.message
        });
    }
};

export const getMunicipioById = async (req, res) => {
    try {
        const { id } = req.params;
        const [municipio] = await pool.query(
            'SELECT * FROM municipios WHERE id_municipio = ?',
            [id]
        );

        if (!municipio) {
            return res.status(404).json({
                success: false,
                message: 'Municipio no encontrado'
            });
        }

        res.json({
            success: true,
            municipio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener municipio',
            error: error.message
        });
    }
};
