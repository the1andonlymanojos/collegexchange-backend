export default async function (request, reply){
    const body = request.body;
    console.log(body)
    console.log("BODY")
    const searchString = request.body.searchString;
    const offset = request.body.offset;
    const limit = request.body.limit;

    const query = `
    SELECT distinct *
    FROM listings
    WHERE MATCH(title, description) AGAINST (? IN NATURAL LANGUAGE MODE)
    ORDER BY MATCH(title, description) AGAINST (? IN NATURAL LANGUAGE MODE) DESC
    LIMIT ? OFFSET ? ;
  `;
    const queryInputs = [searchString, searchString, limit, offset];
    const connection = await this.mysql.getConnection()
    try{
        const [results, fields] = await connection.query(query, queryInputs);

        console.log(results)
        if (results.length===0){
            const recentListingsQuery = `SELECT * FROM listings ORDER BY id DESC LIMIT 10;`
            const [results1, fields1] = await connection.query(recentListingsQuery);
            for (const result of results1) {
                let query2 = "SELECT pathOriginal, pathThumbnail FROM images WHERE ";
                for (const image of result.images) {
                    query2=query2.concat(`id = ${image} OR `);
                }
                query2=query2.slice(0, -4);
                result.description = result.description.split("TAGS:")[0];
                const [results2, fields2] = await connection.query(query2);
                for (let i = 0; i < results2.length; i++) {
                    if(results2[i].pathThumbnail){
                        results2[i] = `${results2[i].pathThumbnail}`;
                    }
                    else{
                        results2[i] = `${results2[i].pathOriginal}`;
                    }
                }
                result.images = results2;
            }

            reply.code(404).send({message: "no listings found", listings:results1})
            return;
        }
        for (const result of results) {

            let query2 = "SELECT pathOriginal FROM images WHERE ";
            for (const image of result.images) {
                query2=query2.concat(`id = ${image} OR `);
            }
            query2=query2.slice(0, -4);
            const [results2, fields2] = await connection.query(query2);
            for (let i = 0; i < results2.length; i++) {
                //make urls
                results2[i] = `${results2[i].pathOriginal}`;
                //replace originals with thumbnails for thumbnails
            }
            result.images = results2;
        }
        reply.code(200).send({message: "success", listings: results})

    }catch(err){
        console.log(err)
        reply.code(500).send({message: "Internal Server Error"})
    }
    finally {
        connection.release()

    }
}



const fillerWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'like'];

function constructSearchQuery(searchString) {
    // Tokenize the search string into words
    const words = searchString.toLowerCase().split(/\s+/);

    // Filter out filler words
    const keywords = words.filter(word => !fillerWords.includes(word));
    //add % to each keyword
    for (let i = 0; i < keywords.length; i++) {
        keywords[i] = `%${keywords[i]}%`;
    }
    let query2 = 'SELECT DISTINCT * FROM listings WHERE ';
    for (let i = 0; i < keywords.length; i++) {
        query2 = query2.concat('description LIKE ? OR ');
    }
    for (let i = 0; i < keywords.length; i++) {
        query2 = query2.concat('title LIKE ? OR ');
    }

    query2 = query2.slice(0, -4);
    keywords.push(...keywords);
    console.log(keywords+" here ")
    return{ query2, keywords};
}
