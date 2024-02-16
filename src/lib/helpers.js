import bcrypt from 'bcryptjs';

const helpers = {};

//These are functions to encrypt and match passwords
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

//These are functions to protect routes
helpers.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
};

helpers.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/user');
};

//These are functions that help to change from string to id
helpers.id_muni = (req) => {
    switch (req.toLocaleLowerCase()) {
        case 'ahumada':
            return 1;
            break;
        case 'aldama':
            return 2;
            break;
        case 'allende':
            return 3;
            break;
        case 'aquiles serdán':
            return 4;
            break;
        case 'ascensión':
            return 5;
            break;
        case 'bachíniva':
            return 6;
            break;
        case 'balleza':
            return 7;
            break;
        case 'batopilas':
            return 8;
            break;
        case 'bocoyna':
            return 9;
            break;
        case 'buenaventura':
            return 10;
            break;
        case 'camargo':
            return 11;
            break;
        case 'carichí':
            return 12;
            break;
        case 'casas grandes':
            return 13;
            break;
        case 'chihuahua':
            return 14;
            break;
        case 'coronado':
            return 15;
            break;
        case 'coyame del sotol':
            return 16;
            break;
        case 'cuauhtémoc':
            return 17;
            break;
        case 'cusihuiriachi':
            return 18;
            break;
        case 'delicias':
            return 19;
            break;
        case 'dr. belisario domínguez':
            return 20;
            break;
        case 'galeana':
            return 21;
            break;
        case 'gómez farías':
            return 22;
            break;
        case 'gran morelos':
            return 23;
            break;
        case 'guachochi':
            return 24;
            break;
        case 'guadalupe':
            return 25;
            break;
        case 'guadalupe y calvo':
            return 26;
            break;
        case 'guazapares':
            return 27;
            break;
        case 'guerrero':
            return 28;
            break;
        case 'hidalgo del parral':
            return 29;
            break;
        case 'huejotitán':
            return 30;
            break;
        case 'ignacio zaragoza':
            return 31;
            break;
        case 'janos':
            return 32;
            break;
        case 'jiménez':
            return 33;
            break;
        case 'juárez':
            return 34;
            break;
        case 'julimes':
            return 35;
            break;
        case 'lópez':
            return 36;
            break;
        case 'madera':
            return 37;
            break;
        case 'maguarichi':
            return 38;
            break;
        case 'manuel benavides':
            return 39;
            break;
        case 'matachí':
            return 40;
            break;
        case 'matamoros':
            return 41;
            break;
        case 'meoqui':
            return 42;
            break;
        case 'morelos':
            return 43;
            break;
        case 'moris':
            return 44;
            break;
        case 'namiquipa':
            return 45;
            break;
        case 'nonoava':
            return 46;
            break;
        case 'nuevo casas grandes':
            return 47;
            break;
        case 'ocampo':
            return 48;
            break;
        case 'ojinaga':
            return 49;
            break;
        case 'praxedis g. guerrero':
            return 50;
            break;
        case 'riva palacio':
            return 51;
            break;
        case 'rosales':
            return 52;
            break;
        case 'rosario':
            return 53;
            break;
        case 'san francisco de borja':
            return 54;
            break;
        case 'san francisco de conchos':
            return 55;
            break;
        case 'san francisco del oro':
            return 56;
            break;
        case 'santa bárbara':
            return 57;
            break;
        case 'santa isabel':
            return 58;
            break;
        case 'santiago de chuco':
            return 59;
            break;
        case 'saucillo':
            return 60;
            break;
        case 'temósachic':
            return 61;
            break;
        case 'urique':
            return 62;
            break;
        case 'uruachi':
            return 63;
            break;
        case 'valle de zaragoza':
            return 64;
            break;
        case 'valle de allende':
            return 65;
            break;
        case 'villa ahumada':
            return 66;
            break;
        case 'zaragoza':
            return 67;
            break;
        default:
            return null; 
            break;
    }
}

helpers.id_hosp = (req) => {
    switch (req.toLocaleLowerCase()) {
        case 'hospital central universitario':
            return 1;
            break;
        case 'ichisal':
            return 2;
            break;
        case 'issste clínica de medicina familiar':
            return 3;
            break;
        case 'hospital general regional no 1, unidad morelos del instituto mexicano del seguro social':
            return 4;
            break;
        case 'hospital infantil de especialidades de chihuahua':
            return 5;
            break;
        case 'hospital general de chihuahua "dr. salvador zubirán anchondo"':
            return 6;
            break;
        default:
            return null;
            break;
    }
}

helpers.id_medi = (req) => {
    switch (req.toLocaleLowerCase()) {
        case 'paracetamol':
            return 1;
            break;
        case 'omeprazol':
            return 2;
            break;
        case 'losartan':
            return 3;
        case 'metropolol':
            return 4;
            break;
        case 'metformina':
            return 5;
            break;
        case 'atorvastatina':
            return 6;
            break;
        case 'bezafibrato':
            return 7;
            break;
        case 'ácido acetilsalicílico':
            return 8;
            break;
        case 'insulina (nph, glargina)':
            return 9;
            break;
        case 'diclofenaco':
            return 10;
            break;
        case 'complejo b':
            return 11;
            break;
        default:
            return null;
            break;
    }
}

export default helpers;