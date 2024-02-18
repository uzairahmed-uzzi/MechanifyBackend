const express = require('express')
const router = express.Router()
const {verifyTokenForAdmin} = require('../middlewares/jwt')
const {getAllAppDetails,getAppDetailById,addAppDetail,updateAppDetail,deleteAppDetailById} = require('../controllers/appDetailController')

router.use(verifyTokenForAdmin)

router.get('/getAllAppDetails',getAllAppDetails)
router.get('/getAppDetailById/:id',getAppDetailById)
router.post('/addAppDetail',addAppDetail)
router.put('/updateAppDetail/:id',updateAppDetail)
router.delete('/deleteAppDetailById/:id',deleteAppDetailById)

module.exports = router