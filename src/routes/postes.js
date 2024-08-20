import { Router } from "express";
import bodyParser from 'body-parser';
import fs from "fs-extra";
import moment from "moment";
import pool from "../db.js";
import helpers from "../lib/helpers.js";
import cloudinary from "cloudinary"

const post = Router();

post.use(bodyParser.urlencoded({ extended: false }));

post.post('/user/donaciones', helpers.isLoggedIn, async (req, res) => {

    const id_medicamento = helpers.id_medi(req.body.medicamento),
        id_hospital = helpers.id_hosp(req.body.hospital),
        lote = req.body.lote.toLocaleUpperCase(),
        caducidad = `${req.body.caducidad}-${'01'}`,
        mgramos = req.body.mgramos,
        cantidad = req.body.cantidad,
        now = moment().format('YYYY-MM-DD'),
        descripcion = req.body.descripcion;

    if (mgramos > 0 && cantidad > 0 && caducidad > now && req.file != undefined) {


        let rutacloud = await cloudinary.v2.uploader.upload(req.file.path);

        const valores = [id_medicamento, id_hospital, [req.user.id_usuario], lote, caducidad, mgramos, cantidad, rutacloud.url, descripcion];
        await pool.query("INSERT INTO formularios (id_medicamento, id_hospital, id_usuario, lote, caducidad, mgramos, cantidad, rutaimg, descripcion, estatus, created_at, active) values (?,?,?,?,?,?,?,?,?, 'In process', now(), 1)", valores, (error, resultado) => {
            if (error) {
                console.error('No se inserto el formulario' + error.message);
                res.redirect('/user/donaciones');
            } else {
                const id = resultado;
                res.redirect('/user/donaciones/' + id.insertId + '/confirmacion');
            }
        });
    } else {
        res.redirect('/user/donaciones');
    }
});

post.post('/userhospital/profile', helpers.isLoggedIn, async (req, res) => {

    const password = req.body.password;

    const rows = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [req.user.id_usuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {

            const name = req.body.name,
                tel = req.body.tel,
                direcc = req.body.direcc,
                email = req.body.email;

            const values = [name, tel, direcc, email, [req.user.id_usuario]];
            await pool.query('UPDATE usuarios SET name = ?, tel = ?, direcc = ?, email = ?, updated_at = now() WHERE id_usuario = ? ', values, (err, result) => {
                if (err) {
                    res.redirect('/user/profile');
                } else {
                    res.redirect('/user/profile');
                }
            });
        } else {
            res.redirect('/user/profile');
        }
    } else {
        res.redirect('/user/profile');
    }

});

post.post('/user/profile', helpers.isLoggedIn, async (req, res) => {

    const password = req.body.password;

    const validPassword = await helpers.matchPassword(password, req.user.password);
    if (validPassword) {

        const name = req.body.name,
            lastname = req.body.lastname,
            tel = req.body.tel,
            direcc = req.body.direcc,
            curp = req.body.curp.toLocaleUpperCase(),
            email = req.body.email;

        const values = [name, lastname, tel, direcc, curp, email, [req.user.id_usuario]];
        await pool.query('UPDATE usuarios SET name = ?, lastname = ?, tel = ?, direcc = ?, curp = AES_ENCRYPT(?,"curp"), email = ?, updated_at = now() WHERE id_usuario = ?', values, (err, result) => {
            if (err) {
                res.redirect('/user/profile');
                console.log(err);
            } else {
                res.redirect('/user/profile');
            }
        });
    } else {
        res.redirect('/user/profile');
    }
});

// Quitar next
post.post('/user/profile/ine', helpers.isLoggedIn, async (req, res) => {

    if (req.file !== undefined && req.file !== null && req.file !== '') {

        let rutacloud = await cloudinary.v2.uploader.upload(req.file.path);

        const values = [rutacloud, [req.user.id_usuario]];
        await pool.query('UPDATE usuarios SET rutaine = ?, updated_at = now() WHERE id_usuario = ?', values, (err, result) => {
            if (err) {
                res.redirect('/user/profile');
            } else {
                res.redirect('/user/profile');
            }
        });
    } else {
        res.redirect('/user/profile');
    }
});

post.post('/user/profile/delete', helpers.isLoggedIn, async (req, res) => {

    const password = req.body.password;

    const validPassword = await helpers.matchPassword(password, req.user.password);
    if (validPassword) {

        await pool.query('DELETE FROM sessions WHERE session_id = ?', [req.sessionID], async (err) => {
            if (err) {
                res.redirect('/user/profile');
            } else {
                // Delete user's ine from the database 
                const imgine = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [req.user.id_usuario]);
                const ine = imgine[0];
                try {
                    await fs.unlink(path.resolve('./src/public/files/' + ine.rutaine));
                } catch (error) {
                    console.log('no se encontro INE');
                }
                // Delete forms' images
                const images = await pool.query('SELECT * FROM formularios WHERE id_usuario= ?', [req.user.id_usuario]);
                images.forEach(async (img) => {
                    try {
                        await fs.unlink(path.resolve('./src/public/files/' + img.rutaimg));
                    } catch (error) {
                        console.log("No hay imagenes");
                    }
                });
                // Delete user and forms from the database
                await pool.query('CALL delete_user (?)', [req.user.id_usuario]);
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/user/profile');
    }
});

export default post;