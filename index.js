const express = require('express')
const uuid = require('uuid')
const port = 5500
const app = express()

app.use(express.json())


app.listen(port, () => 
    console.log(`Server started on port ${port}`)
)

const orders = []

const myMiddleware = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(order => order.id == id)
    if(index < 0){
        return response.status(404).json({error: "Order not found"})
    }

    request.orderIndex = index
    request.orderId = id
    next()
}

app.get('/order', (request, response) => {
    return response.status(200).json(orders)
})

app.post('/order', (request, response) => {
    const {order, clientName, price} = request.body
    const newOrder = { id:uuid.v4(), order, clientName, price, status: "Em preparação"}
    orders.push(newOrder)
    return response.status(201).json(orders)
})

app.put('/order/:id', myMiddleware, (request, response) => {
    const {order, clientName, price} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updatedOrder = {id, order, clientName, price, status: "Em preparação"}

    orders[index] = updatedOrder

    return response.status(200).json(updatedOrder)
})

app.delete('/order/:id', myMiddleware, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)
    return response.status(204)
})

app.get('/order/:id', myMiddleware, (request, response) => {
    const index = request.orderIndex
    const order = orders[index]
    return response.status(200).json(order)
})

app.patch('/order/:id', myMiddleware, (request, response) => {
    const {order, clientName, price} = request.body
    const id = request.orderId
    const statusOrder = {id, order, clientName, price, status: "Pronto!"}

    return response.status(200).json(statusOrder)
})



