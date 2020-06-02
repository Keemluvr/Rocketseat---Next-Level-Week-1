import express from 'express'
import knex from './database/connection'

const routes = express.Router()


/**
 * Retorna um ou mais items
*/
routes.get('/items', async (req, res) => {
    const items = await knex('items').select('*')
    // Adicionando a url da imagem
    const serializedtems = items.map(item => {
        return { 
            name: item.title,
            image_url: `http://localhost:3333/uploads/${item.image}`
         }
    })

    return res.json(serializedtems)
})



export default routes
