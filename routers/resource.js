const { Router } = require("express");
const { deleteResource, createResource } = require("../controller/resourceController");

const router = Router()


router.post('/create', createResource)
router.delete('/delete', deleteResource)


module.exports = router;