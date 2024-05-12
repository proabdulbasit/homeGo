const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(user) {
    try {
        const criteria = _buildCriteria(user)
        const collection = await dbService.getCollection('order')
        return await collection.find(criteria).toArray()
    } catch (err) {
        logger.error('cannot load orders', err)
        throw err
    }
}

function _buildCriteria({ id, type }) {
    let criteria = {}
    if (type === 'user') criteria = { 'user._id': id }
    else criteria = { 'host._id': id }
    return criteria
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const orderToAdd = {
            createdAt: Date.now(),
            host: order.host,
            user: order.user,
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            stay: order.stay,
            status: order.status
        }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd;
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const orderToSave = {
            ...order,
            _id: ObjectId(order._id),
            updadetAt: Date.now(),
        };
        const collection = await dbService.getCollection('order');
        await collection.updateOne({ _id: orderToSave._id }, { $set: orderToSave });
        return orderToSave;
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err;
    }
}

module.exports = {
    query,
    remove,
    add,
    update
}
