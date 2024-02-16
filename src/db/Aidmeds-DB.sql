create table municipios (
id_municipio int primary key,
name varchar(80));

create table usuarios (
id_usuario int auto_increment primary key,
name varchar(255) NOT NULL,
lastname varchar(50) NOT NULL,
tel varchar(30) NOT NULL,
direcc varchar(255) NOT NULL,
email varchar(50) NOT NULL,
curp blob NOT NULL,
id_municipio int NOT NULL,
id_hospital int,
password varchar(255) NOT NULL,
rutaine varchar(255) NOT NULL,
created_at DateTime NOT NULL,
updated_at DateTime NOT NULL,
foreign key (id_municipio) references municipios(id_municipio));

create table hospitales (
id_hospital int auto_increment primary key,
name varchar(255),
direc varchar(255),
tel varchar(30),
email varchar(50),
id_municipio int,
created_at datetime,
updated_at datetime,
foreign key (id_municipio) references municipios(id_municipio));

create table medicamentos (
id_medicamento int auto_increment primary key,
name varchar(50),
type varchar(30));

create table invhospitales (
id_invhospital int auto_increment primary key,
id_hospital int,
foreign key (id_hospital) references hospitales(id_hospital));

create table invmed (
id_invhospital int,
id_medicamento int,
cantidad int,
primary key (id_invhospital, id_medicamento),
foreign key (id_invhospital) references invhospitales(id_invhospital),
foreign key (id_medicamento) references medicamentos(id_medicamento));

create table formularios (
id_formulario int auto_increment primary key,
id_medicamento int NOT NULL,
id_hospital int NOT NULL,
id_usuario int NOT NULL,
lote varchar(50) NOT NULL,
caducidad date NOT NULL,
mgramos int NOT NULL,
cantidad int NOT NULL,
rutaimg varchar(255) NOT NULL,
descripcion varchar(255) NOT NULL,
created_at datetime NOT NULL,
active int NOT NULL,
estatus varchar(30),
constraint fk_usuario foreign key (id_usuario) references usuarios(id_usuario),
constraint fk_hospital foreign key (id_hospital) references hospitales(id_hospital),
foreign key (id_medicamento) references medicamentos(id_medicamento));

INSERT INTO municipios (id_municipio, name) VALUES
(1, 'Ahumada'), (2, 'Aldama'), (3, 'Allende'), (4, 'Aquiles Serdán'), (5, 'Ascensión'), (6, 'Bachíniva'), (7, 'Balleza'),
(8, 'Batopilas'), (9, 'Bocoyna'), (10, 'Buenaventura'), (11, 'Camargo'), (12, 'Carichí'), (13, 'Casas Grandes'), (14, 'Chihuahua'),
(15, 'Coronado'), (16, 'Coyame del Sotol'), (17, 'Cuauhtémoc'), (18, 'Cusihuiriachi'), (19, 'Delicias'), (20, 'Dr. Belisario Domínguez'),
(21, 'Galeana'), (22, 'Gómez Farías'), (23, 'Gran Morelos'), (24, 'Guachochi'), (25, 'Guadalupe'), (26, 'Guadalupe y Calvo'),
(27, 'Guazapares'), (28, 'Guerrero'), (29, 'Hidalgo del Parral'), (30, 'Huejotitán'), (31, 'Ignacio Zaragoza'), (32, 'Janos'),
(33, 'Jiménez'), (34, 'Juárez'), (35, 'Julimes'), (36, 'López'), (37, 'Madera'), (38, 'Maguarichi'), (39, 'Manuel Benavides'),
(40, 'Matachí'), (41, 'Matamoros'), (42, 'Meoqui'), (43, 'Morelos'), (44, 'Moris'), (45, 'Namiquipa'), (46, 'Nonoava'), (47, 'Nuevo Casas Grandes'),
(48, 'Ocampo'), (49, 'Ojinaga'), (50, 'Praxedis G. Guerrero'), (51, 'Riva Palacio'), (52, 'Rosales'), (53, 'Rosario'), (54, 'San Francisco de Borja'),
(55, 'San Francisco de Conchos'), (56, 'San Francisco del Oro'), (57, 'Santa Bárbara'), (58, 'Santa Isabel'), (59, 'Santiago de Chuco'),
(60, 'Saucillo'), (61, 'Temósachic'), (62, 'Urique'), (63, 'Uruachi'), (64, 'Valle de Zaragoza'), (65, 'Valle de Allende'),
(66, 'Villa Ahumada'), (67, 'Zaragoza');

INSERT INTO medicamentos (name,type) VALUES
('Paracetamol','without prescription'),
('Omeprazol','without prescription'),
('Losartan','by prescription'),
('Metropolol','without prescription'),
('Metformina','by prescription'),
('Atorvastatina','by prescription'),
('Bezafibrato','by prescription'),
('Ácido acetilsalicílico','without prescription'),
('Insulina (NPH, glargina)','by prescription'),
('Diclofenaco','without prescription'),
('Complejo B','without prescription');

CREATE UNIQUE INDEX ind_curp ON  usuarios(curp);

CREATE UNIQUE INDEX ind_email ON usuarios(email);

CREATE UNIQUE INDEX ind_tel ON usuarios(tel);

CREATE UNIQUE INDEX ind_hostel ON hospitales(tel);

CREATE UNIQUE INDEX ind_hosemail ON hospitales(email);

CREATE UNIQUE INDEX ind_hosname ON hospitales(name);

CREATE UNIQUE INDEX ind_hosdirec ON hospitales(direc);

CREATE VIEW view_medicamentos AS 
SELECT name FROM medicamentos;

CREATE VIEW view_hospitales AS 
SELECT name FROM hospitales;

DELIMITER //
CREATE TRIGGER inv_hospital
AFTER INSERT ON hospitales
FOR EACH ROW 
BEGIN
INSERT INTO invhospitales (id_invhospital ,id_hospital) VALUES (NEW.id_hospital ,NEW.id_hospital);
END;  
//

DELIMITER $$
CREATE PROCEDURE delete_user
( IN usuario INT )
BEGIN
START TRANSACTION;
SET @usr = usuario;
DELETE FROM formularios WHERE id_usuario = @usr;
DELETE FROM usuarios WHERE id_usuario =  @usr;
COMMIT;
END
$$

DELIMITER //
CREATE TRIGGER after_insert_invhospitales
AFTER INSERT ON invhospitales
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE medicamento_id INT;
    DECLARE medicamento_cursor CURSOR FOR
        SELECT id_medicamento FROM medicamentos;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN medicamento_cursor;
    cursor_loop: LOOP
        FETCH medicamento_cursor INTO medicamento_id;
        IF done THEN
            LEAVE cursor_loop;
        END IF;
        INSERT INTO invmed (id_invhospital, id_medicamento, cantidad)
        VALUES (NEW.id_invhospital, medicamento_id, 0);
    END LOOP;
    CLOSE medicamento_cursor;
END;
//

DELIMITER //
CREATE TRIGGER after_update_formularios
AFTER UPDATE ON formularios
FOR EACH ROW
BEGIN
    IF NEW.estatus = 'Accepted' AND NEW.active = 0 THEN
        UPDATE invmed
        SET cantidad = cantidad + (SELECT MAX(cantidad) FROM formularios WHERE id_formulario = NEW.id_formulario)
        WHERE id_invhospital = (
            SELECT id_hospital
            FROM formularios
            WHERE id_formulario = NEW.id_formulario
        ) AND id_medicamento = NEW.id_medicamento;
    END IF;
END;
//

DELIMITER //
CREATE TRIGGER user_hospital
AFTER INSERT ON hospitales
FOR EACH ROW 
BEGIN
SET @random_password = SUBSTRING(MD5(RAND()), 1, 8);
SET @random_curp = SUBSTRING(MD5(RAND()),1,18);
INSERT INTO usuarios (name, lastname,tel,direcc,email,curp,id_municipio,id_hospital,password,rutaine,created_at,updated_at) VALUES (NEW.name, '-----', NEW.tel, NEW.direc, NEW.email, @random_curp, NEW.id_municipio, NEW.id_hospital, @random_password, '-----', now(),now()); 
END;
//


INSERT INTO hospitales(name,direc,tel,email,id_municipio,created_at,updated_at)
VALUES
('Hospital Central Universitario','C. Antonio Rosales 33000, Obrera, 31350 Chihuahua, Chih.','614 180 0800','hospitalCentralCUU@gmail.com',14,now(),now()),
('ICHISAL','Matamoros & Guadalupe, Jardines del Santuario, 31020 Chihuahua, Chih.','614 429 3200','ichisalCUU@gmail.com', 14,now(),now()),
('ISSSTE Clínica de Medicina Familiar','Ahuehuete 505, Ángel Trías, 31203 Chihuahua, Chih.',' 614 415 0028','ISSSTECUU@gmail.com',14,now(),now()),
('Hospital General Regional No 1, Unidad Morelos del Instituto Mexicano Del Seguro Social','Calle Ortiz de Campos, Esq. Universidad 500-Sector 5, San Felipe I Etapa, 31203 Chihuahua, Chih.','614 413 0728', 'HospitalGen1CUU@gmail.com',14, now(),now()),
('Hospital Infantil de Especialidades de Chihuahua','Av. Carlos Pacheco Villa s/n, Cerro Cnel. II, Robinson, 31090 Chihuahua, Chih.','614 429 3300', 'hosInfantilCUU@gmail.com',14, now(), now()),
('Hospital General de Chihuahua "Dr. Salvador Zubirán Anchondo"',' Av. Prol. Teófilo Borunda 510, Colonia, El Bajo, 31200 Chihuahua, Chih.','','HospitalGeneralCUU@gmail.com',14, now(),now());