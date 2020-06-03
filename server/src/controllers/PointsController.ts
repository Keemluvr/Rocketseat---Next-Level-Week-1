import { Request, Response } from 'express'
import knex from '../database/connection'

export default class PointsController {
    /**
     * Cadastra pontos de coleta
     */
    async create (req: Request, res:Response) {
        // desestrutura a requisição
        const {
            name,
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city,
            uf,
            items
        } = req.body
        // (Atomicidade) Criado para que todas as transações executem 
        const trx = await knex.transaction()
        const point = {
            image: 'image_fake',
            name,
            email, 
            whatsapp, 
            latitude, 
            longitude, 
            city,
            uf
        }
        // Insere um ponto de coleta no banco (sem os items ainda)
        const inserteIds = await trx('points').insert(point)
        const point_id = inserteIds[0]
        // Mapeia os items e adiciona o ID do ponto de coleta 
        const pointItems = items.map( (item_id:number) => {
            return {
                item_id,
                point_id
            }
        })
        // Relaciona um ponto aos seus items de coleta
        await trx('point_items').insert(pointItems)
    
        return res.json({ 
            id: point_id,
            ...point
        })
    }
    
}