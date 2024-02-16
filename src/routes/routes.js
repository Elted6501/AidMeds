import { Router } from 'express';
import fs from 'fs-extra';
import path from "path";
import cloudinary from 'cloudinary';
import helpers from '../lib/helpers.js';
import pool from '../db.js';

const router = Router();

// Main pages
router.get('/', helpers.isNotLoggedIn, (req, res) => res.render('index'));

router.get('/test', helpers.isNotLoggedIn, (req, res) => res.render('test'));

router.get('/service', helpers.isNotLoggedIn, (req, res) => res.render('service'));

router.get('/login', helpers.isNotLoggedIn, (req, res) => res.render('Login'));

router.get('/layout', helpers.isNotLoggedIn, async (req, res) => {

    const municipio = await pool.query("SELECT * FROM municipios");

    res.render('layout', { municipio })
});

router.get('/cuentacreada', helpers.isLoggedIn, (req, res) => res.render('cuenta creada'));

router.get('/forgotpassword', (req, res) => res.render('500'));

router.get('/resetpassword', (req, res) => res.render('500'));

// Dashboards
router.get('/user', helpers.isLoggedIn, (req, res) => res.render('user'));

router.get('/user/profile', helpers.isLoggedIn, async (req, res) => {
    const curp = await pool.query('SELECT CAST(AES_DECRYPT(curp,"curp") AS CHAR) AS curp FROM usuarios WHERE id_usuario = ?', [req.user.id_usuario]);
    const cur = curp[0];
    res.render('profile', { cur });
});

router.get('/user/donaciones', helpers.isLoggedIn, async (req, res) => {

    const medicine = await pool.query("SELECT * FROM view_medicamentos");
    const hospital = await pool.query("SELECT * FROM view_hospitales");

    res.render('donaciones', { medicine, hospital })
});

router.get('/user/donaciones/:id/confirmacion', helpers.isLoggedIn, async (req, res) => {
    const { id } = req.params;

    const confirmacion = await pool.query("SELECT formularios.id_formulario, medicamentos.name AS medicamento, hospitales.name AS hospital, hospitales.direc, formularios.estatus, formularios.lote, DATE_FORMAT( formularios.caducidad, '%m/%Y') AS caducidad, formularios.mgramos, formularios.cantidad, DATE_FORMAT( formularios.created_at, '%d/%m/%Y') AS created_at " +
        "FROM formularios " +
        "JOIN medicamentos " +
        "JOIN hospitales " +
        "JOIN usuarios " +
        "ON medicamentos.id_medicamento = formularios.id_medicamento " +
        "AND hospitales.id_hospital = formularios.id_hospital " +
        "WHERE formularios.id_formulario = ?", [id]);
    const conf = confirmacion[0];

    res.render('confirmacion', { conf });
});

router.get('/user/historial', helpers.isLoggedIn, async (req, res) => {
    const history = await pool.query(
        "SELECT formularios.id_formulario, medicamentos.name AS medicamento, hospitales.name AS hospital, formularios.estatus, formularios.lote, DATE_FORMAT( formularios.caducidad, '%m/%Y') AS caducidad, formularios.mgramos, formularios.cantidad, DATE_FORMAT( formularios.created_at, '%d/%m/%Y') AS created_at " +
        "FROM formularios " +
        "JOIN medicamentos " +
        "JOIN hospitales " +
        "ON medicamentos.id_medicamento = formularios.id_medicamento " +
        "AND hospitales.id_hospital = formularios.id_hospital " +
        "WHERE formularios.id_usuario = ?", [req.user.id_usuario]);
    res.render('historial', { history });
});

router.get('/user/listahosp', helpers.isLoggedIn, async (req, res) => {
    const hospitals = await pool.query("SELECT * FROM hospitales");
    res.render('listahosp', { hospitals });
});

router.get('/user/listamed', helpers.isLoggedIn, async (req, res) => {
    const medicines = await pool.query("SELECT * FROM medicamentos");
    res.render('listamed', { medicines });
});

router.get('/user/formularios', helpers.isLoggedIn, async (req, res) => {
    const forms = await pool.query("SELECT formularios.rutaimg, formularios.id_formulario, medicamentos.name AS medicamento, hospitales.name AS hospital, formularios.descripcion, formularios.lote, DATE_FORMAT( formularios.caducidad, '%m/%Y') AS caducidad, formularios.mgramos, formularios.cantidad, DATE_FORMAT( formularios.created_at, '%d/%m/%Y') AS created_at " +
        "FROM formularios " +
        "JOIN medicamentos " +
        "JOIN hospitales " +
        "ON medicamentos.id_medicamento = formularios.id_medicamento " +
        "AND hospitales.id_hospital = formularios.id_hospital " +
        "WHERE formularios.id_hospital = ? and active = 1", [req.user.id_hospital]);
    res.render('formularios', { forms });
});

router.get('/user/inventario', helpers.isLoggedIn, async (req, res) => {
    const inventory = await pool.query("SELECT medicamentos.name, invmed.cantidad " +
        "FROM invmed " +
        "JOIN medicamentos " +
        "ON medicamentos.id_medicamento = invmed.id_medicamento " +
        "WHERE id_invhospital = ?", [req.user.id_hospital]);

    res.render('inventario', { inventory });
});

// Updates
router.get('/update/check/:id', helpers.isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('UPDATE formularios SET active = 0, estatus = "Accepted" WHERE id_formulario = ?', [id]);
    res.redirect('/user/formularios');
});

router.get('/update/reject/:id', helpers.isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('UPDATE formularios SET active = 0, estatus = "Rejected" WHERE id_formulario = ?', [id]);
    res.redirect('/user/formularios');
});

export default router;