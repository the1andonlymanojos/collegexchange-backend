export default async function (request, reply){
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;
    const filters = request.query.filters || {};
   //build mysql query based on filters
    let query = `select * from listings where `
    //tokenize category string, and add to query
    //if (filters.category) query += `category = ${filters.category} and `
    // implement category filter after figuring out how to implement categories
    //price
    if (filters.price){
        if (filters.price.min) query += `suggested_minimum_bid >= ${filters.price.min} and `
        if (filters.price.max) query += `suggested_minimum_bid <= ${filters.price.max} and `
    }
    //availability
    if (filters.availability) query += `availability = ${filters.availability} and `
    //location
    if (filters.location) query += `location = ${filters.location} and `
    //search to be implemented later, for now the plan is to tokenize search string, then search for each token in title, description, and category columns, then rank based on number of tokens matched.
//remove where if no filters are provided
    if (query.slice(-6) === 'where '){
        query = query.slice(0,-6)
    }
    if(query.slice(-4) === 'and '){
        query = query.slice(0,-4)
    }


    query += ` limit ${limit} offset ${offset}`
    console.log(query)
    const connection = await this.mysql.getConnection()
    try{

        const [rows, fields] = await connection.query(query)
        const imageIDs = [];
        for (const row of rows) {
            for (let i = 0; i < row.images.length; i++) {
                imageIDs.push(row.images[i])
            }
        }

        console.log(imageIDs)
        reply.send(rows)
    }catch(err){
        console.log(err)
        reply.code(500).send({message: "Internal Server Error"})
    }
    finally {
        connection.release()

    }
}

const schema = {
    querystring: {
        limit: {type: 'number'},
        offset: {type: 'number'},
        filters: {type: 'object',
            properties:{
                category: {type: 'string'},
                price: {type: 'object',
                    properties: {
                        min: {type: 'number'},
                        max: {type: 'number'}
                    }
                },
                availability: {type: 'string'},
                location: {type: 'string'},
                search: {type: 'string'}
            }
        }
    }
}