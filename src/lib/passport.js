import passport from 'passport';
import { Strategy as passport_local } from 'passport-local';
import fs from 'fs-extra';
import cloudinary from 'cloudinary';
import pool from '../db.js';
import helpers from './helpers.js';

const LocalStrategy = passport_local

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const rows = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user);
        } else {
            done(null, false, req.flash('message', 'Incorrect password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The email does not exist'));
    }
}
));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    if (req.file != undefined) {

        if (password.length >= 8) {

            const name = req.body.name,
                lastname = req.body.lastname,
                tel = req.body.tel,
                direcc = req.body.direcc,
                curp = req.body.curp.toLocaleUpperCase(),
                id_municipio = helpers.id_muni(req.body.municipio),
                rutacloudine = await cloudinary.v2.uploader.upload(req.file.path)
                    .then(async (result) => {
                        await fs.unlink(req.file.path);
                        return result.secure_url;
                    })
                    .catch((err) => {
                        console.log(err);
                        return req.file.path;

                    });
                console.log(rutacloudine);


            const newUser = {
                email,
                password,
            };

            newUser.password = await helpers.encryptPassword(password);

            let validcurp = curp.substring(0, 2);
            let firstlastnameletter = lastname.toLocaleUpperCase().substring(0, 1);
            let firstlastnamevocal = lastname.toLocaleUpperCase().substring(1,).match(/[AEIOU]/)[0];

            if (validcurp === firstlastnameletter + firstlastnamevocal) {

                const valores = [name, lastname, tel, direcc, newUser.email, curp, id_municipio, newUser.password, rutacloudine];
                await pool.query('INSERT INTO usuarios (name, lastname, tel, direcc, email, curp, id_municipio, password, rutaine, created_at, updated_at) VALUES (?,?,?,?,?,AES_ENCRYPT(?,"curp"),?,?,?,now(),now())', valores,
                    (err, resultado) => {
                        if (err) {

                            console.log(err);
                            done(null, false, req.flash('message', 'Check your data'));
                        } else {
                            newUser.id_usuario = resultado.insertId;
                            done(null, newUser);
                        }
                    });
            } else {
                done(null, false, req.flash('message', 'Check your curp'));
            }
        } else {
            done(null, false, req.flash('message', 'Password is so short'));
        }
    } else {
        done(null, false, req.flash('message', 'File was not supported'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
    done(null, rows[0]);
});