const bcrypt = require('bcrypt');
const saltRounds = 8;

// Generate the salt
const salt = bcrypt.genSaltSync(saltRounds);

const hashed = (pass) => {



    // Hash the original password with the generated salt
    const hashedPassword = bcrypt.hashSync(pass, salt);
    //console.log(hashedPassword);
    return hashedPassword.toString()
}


const checkpass = (userpassword, dbpassword) => {

    // Compare the provided password with the hashed password
    return bcrypt.compareSync(userpassword, dbpassword);




}

module.exports = { checkpass, hashed }