const express = require('express')
const { getStay, getStays, deleteStay, updateStay, addStay } = require('./stay.controller')
const router = express.Router()

router.get('/', getStays)
router.get('/:id', getStay)
router.put('/:id', updateStay)
router.post('/', addStay)
router.delete('/:id', deleteStay)

module.exports = router