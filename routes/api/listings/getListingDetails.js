export default async function (request, reply){
    const id = request.params.id;
    const connection = await this.mysql.getConnection();
    let query = "SELECT * FROM listings WHERE id = ?";
    try{
        let [results, fields] = await connection.query(query, [id]);
        let query2 = "SELECT path FROM images WHERE ";
        for (const image of results[0].images) {
            query2=query2.concat(`id = ${image} OR `);
            console.log(query2)
        }
        query2=query2.slice(0, -4);
        let [results2, fields2] = await connection.query(query2);
        for (let i = 0; i < results2.length; i++) {
            //make urls
            results2[i] = `${request.protocol}://${request.hostname}/${results2[i].path}`;
            //replace originals with thumbnails for thumbnails
            results2[i] = results2[i].replace('originals', 'thumbnails');

        }
        results[0].images = results2;



        const getOffersQuery = 'SELECT * FROM offers WHERE listing_id = ? ORDER BY amount DESC LIMIT 5';
        const [offersResults, offersFields] = await connection.query(getOffersQuery, [id]);
        //wipe bidder_id and owner_id, for privacy reasons, replace with -1. have frontend give random names and pfp for anonymity.
        for (let i = 0; i < offersResults.length; i++) {
            offersResults[i].bidder_id = -1;
            offersResults[i].owner_id = -1;
        }
        const getOffersByUserQuery = 'SELECT * FROM offers WHERE bidder_id = ? and listing_id=? ORDER BY amount DESC limit 5';
        const [offersByUserResults, offersByUserFields] = await connection.query(getOffersByUserQuery, [request.user.userID, id]);
        //append this to offersResults
        offersResults.push(...offersByUserResults);
        //append this to results
        results[0].offers = offersResults;



        if(results.length === 0){
            reply.code(404).send({message: "Listing not found"});
        } else {
            reply.code(200).send(results[0]);
        }
    } catch (e) {
        console.error(e);
        reply.code(500).send({message: "Internal Server Error"});
    } finally {
        connection.release();
    }
}