export default class serialized { 
    
    public static serializedArray( array: any[] ) {
        const serialized = array.map( item => {
            return {    
                ...array,
                image_url: `http://192.168.0.103:3333/uploads/${item.image}`
            }
        })
    }

    public static serializedItem( item: any ) {
        return {    
            ...item,
            image_url: `http://192.168.0.103:3333/uploads/${item.image}`
        }
    }

}
