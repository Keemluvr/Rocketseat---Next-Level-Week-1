import api from './config'

export default {
    listar: () => {
        return api.get('/items')
    }
}