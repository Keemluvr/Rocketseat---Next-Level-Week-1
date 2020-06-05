import { Request, Response } from 'express'
import knex from '../database/connection'
import serialized from '../utils/serializedPoints'

export default class PointsController {

    /**
     * Lista os pontos atraves de um filtro
     */
    async index (req: Request, res: Response) {
        const { city, uf, items} = req.query
        // Converte a string em array
        const parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()) )
        // Retorna os pontos de coleta através do ID dos itens pesquisados
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')
        // Serializa
        const serializedPoints = serialized.serializedArray(points)

        return res.json(serializedPoints)
    }

    /**
     * Lista um ponto específico de coleta
     */
    async show (req: Request, res: Response) {
        const { id } = req.params
        // Busca do id  no banco de dados
        const point = await knex('points').where('id', id).first()
        // Caso o id nãos eja encontrado, retorna um erro
        if(!point) return res.status(400).json({ message: 'Point not found.'})
        // Retorna o nome dos itens através do seu id
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')
        // Serializa
        const serializedPoint = serialized.serializedItem(point)

        return res.json({ point: serializedPoint, items })
    }

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
            image: req.file.filename,
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
        const pointItems = items
            .split(',')
            .map( (item: string) => Number(item.trim()))
            .map( (item_id: number) => {
            return {
                item_id,
                point_id
            }
        })
        // Relaciona um ponto aos seus items de coleta
        await trx('point_items').insert(pointItems)
    
        // Realiza de vez todas as transações
        await trx.commit()

        return res.json({ 
            id: point_id,
            ...point
        })
    }

}