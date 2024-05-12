const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addOrder, getOrder, getOrders, deleteOrder, updateOrder } = require('./order.controller')
const router = express.Router()

router.get('/', log, getOrders)
router.get('/:id', getOrder)
router.post('/', addOrder)
router.put('/:id', updateOrder)
router.delete('/:id', requireAuth, deleteOrder)
module.exports = router
