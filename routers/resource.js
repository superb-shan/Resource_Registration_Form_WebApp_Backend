const { Router } = require("express");
const { deleteResource, createResource, getResource } = require("../controller/resourceController");

const router = Router()


router.post('/create', createResource)
router.delete('/delete', deleteResource)
router.get('/get', getResource)


module.exports = router;