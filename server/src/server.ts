import express from 'express'

const app = express()
const port = 3333

app.get('/users', (req, res) => {
    res.send('HELLO')
})

app.listen(port)
console.log(`localhost:${port}/Users`)