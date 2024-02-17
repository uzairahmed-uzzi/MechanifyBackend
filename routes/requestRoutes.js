const express= require('express')
const router = express.Router()
const {requestMechanic,getAllRequests,getAllRequestsOfMechanics, getRequest, delRequest, updateRequest} = require('../controllers/requestController')
const {verifyToken} = require("../middlewares/jwt")

router.use(verifyToken)

router.post('/requestMechanic',requestMechanic)
router.get('/allRequests/:id',getAllRequests)
router.get('/allRequestsOfMechanics/:id',getAllRequestsOfMechanics)
router.get('/getRequest/:id',getRequest)
router.delete('/delRequest/:id',delRequest)
router.put('/updateRequest/:id',updateRequest)

module.exports = router