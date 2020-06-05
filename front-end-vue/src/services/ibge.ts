import axios from 'axios'

const api = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})

export default {
    selectedUf: () => {
        return api.get(`/estados`)
    },

    selectedCity: (selectedUf: string) => {
        return api.get(`/estados/${ selectedUf }/municipios`)
    }
}