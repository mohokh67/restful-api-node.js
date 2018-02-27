import config from './../../../config/config'
import express from 'express'
const router = express.Router()
import mongoose from 'mongoose'

const parentRoute = 'orders/'
import Order from '../models/order'
import Product from '../models/product'

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .exec()
        .then(docs =>{
            let response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: config.url + ':' + config.port + '/'+ parentRoute  + doc._id
                        }
                    }
                })
            }
            res.status(200).json({
                message: 'success',
                list : response
            })
        })
        .catch(error =>{
            console.log(error)
            res.status(500).json({
                message: 'error',
                error: error
            })
        })
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'error',
                    detail: 'Product not found'
                })
            }
            let order = new Order({
                product: req.body.productId,
                quantity: req.body.quantity
            })
            return order.save()
        })
        .then(result =>{
            res.status(201).json({
                message: 'OK',
                createdOrder: {
                    id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: config.url + ':' + config.port + '/'+ parentRoute + result._id
                    }
                }
            })
        })
        .catch(error =>{
        console.log(error)
        res.status(500).json({
            message: 'error',
            error: error
        })
        })

})

router.get('/:id', (req, res, next) => {
    let id = req.params.id
    res.status(200).json({
        message: 'Order details' + id
    })
})

router.delete('/:id', (req, res, next) => {
    let id = req.params.id
    res.status(200).json({
        message: 'Order deleted' + id
    })
})

module.exports = router