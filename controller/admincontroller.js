const Admin = require('../models/admin')
const { hashed, checkpass } = require('../hashPassword')
const CreateAdmin = async (req, res) => {
    try {

        const { name, email, password } = req.body
        const admin = await Admin.create({ name, email, password: password });
        return res.json(admin.toJSON()).status(200)
    } catch (err) {
        return res.status(200).json({"error":err.message})
    }
}
const updateAdmin = async (req, res) => {
    const { name, email, id } = req.body
    let password
    if (req.body.password)
        password = hashed(req.body.password)


    const DbAdmin = await Admin.findOne({ where: { name: name } })

    try {
        const admin = await Admin.update({ name: name || DbAdmin.name, email: email || DbAdmin.name, password: password || DbAdmin.password }, { where: { id: id || DbAdmin.id } })

        return res.json(admin).status(200)
    } catch (err) {
        return res.status(200).json(err)
    }
}

const AdminLogin = async (req, res) => {
    try {

        const { name, password } = req.query;

        const admin = await Admin.findOne({ where: { name: name } })
        console.log(admin.password);
        if (checkpass(password, admin.password))
            res.end(JSON.stringify({ "message": true }));
        else
            res.end(JSON.stringify({ "message": false }));

    } catch (err) {
        res.status(200).send(JSON.stringify({ "message": "No admin found" }));
    }
}


module.exports = {
    CreateAdmin: CreateAdmin,
    updateAdmin: updateAdmin,
    AdminLogin: AdminLogin


}