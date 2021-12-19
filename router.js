const express = require('express')
const {getRoot} = require('./controllers/main.controller')
const {doRegister} = require('./controllers/auth.controller')

const router = express.Router()

router.get('/', getRoot)
router.post('/v1/register', doRegister())

module.exports = router