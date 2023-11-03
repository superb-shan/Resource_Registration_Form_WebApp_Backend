const { Router } = require("express");
const { deleteResource, createResource, getResource, createResourceData, getSeminar, getDepartments, getGuesthouse, createGuestHouse } = require("../controller/resourceController");

const router = Router()


router.post('/create', createResource)
router.delete('/delete', deleteResource)
router.get('/get', getResource)
router.get('/add', createResourceData)
router.get('/addGuestHouse', createGuestHouse)
router.get('/getSeminar', getSeminar)
router.get('/getDepartments', getDepartments)
router.get('/getGuesthouse', getGuesthouse)

module.exports = router;