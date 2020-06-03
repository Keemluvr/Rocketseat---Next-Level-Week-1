import { Request, Response } from 'express'
import knex from '../database/connection'

export default class ItemsController {
    /**
     * Retorna um ou mais items presentes no banco de dados
     */
    async index (req: Request, res: Response) {
        const items = await knex('items').select('*')
        // Adicionando a url da imagem
        const serializedtems = items.map(item => {
            return { 
                id: item.id,
                name: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }
        })

        return res.json(serializedtems)
    }
}