const express = require('express')
const {v4: uuidv4} = require('uuid')
const app = express()
const port = 3001
app.use(express.json())

const clients = []

const checkClientsID = (request, response, next) => {
    const {id} = request.params
    const index = clients.findIndex(client => client.id === id)

    if(index < 0){
        return response.status(404).json({error: "Client Not Found"})
    }

    request.clientIndex = index
    request.clientId = id
    next()
}

const methodUrl = (request, response, next)=> {
    const valueMethod = (request.method)
    const valueUrl = (request.url)
    next()
    return console.log("Method:",valueMethod, " URL:",valueUrl)
}

app.post('/order',methodUrl, (request, response) => {
    const { order, clienteName, price, status} = request.body
    const client = { id:uuidv4(), order, clienteName, price, status}
    clients.push(client)
    return response.status(201).json(client)
})

app.get('/order',methodUrl, (request, response) => {
    return response.json(clients)
})

app.get('/order/:id',checkClientsID, methodUrl, (request, response) => {
   const index = request.clientIndex
   return response.json(clients[index])
})

app.put('/order/:id', checkClientsID,methodUrl, (request, response) => {
    const { order, clienteName, price, status} = request.body
    const index = request.clientIndex
    const id = request.clientId
    const clientUpdate = {id, order, clienteName, price, status}
    clients[index] = clientUpdate
    return response.json(clientUpdate)
})

app.delete('/order/:id', checkClientsID, methodUrl, (request, response)=>{
    const index = request.clientIndex
    clients.splice(index,1)
    response.status(204).json()
})

app.patch('/order/:id', checkClientsID, methodUrl, (request, response) => {
    const finished = 'Pronto'
    const index = request.clientIndex  
    clients[index].status = finished
    return response.json(clients[index])

})

app.listen(3001, () =>{
    console.log("🚀Server started on port 3001🚀")
    
})