export default async function (request, reply){
    const userID = request.user.userID;
    try{
        const connection = await this.mysql.getConnection();
        const offerQuery = 'SELECT * FROM offers WHERE bidder_id = ?';
        const [results, fields] = await connection.query(offerQuery, [userID]);
        if (results.length===0){
            reply.code(404).send({message: "no offers found"})
            return;
        }
        //get listing details for each offer, append to results, create list of listing ids first, then query for each listing id.
        let listingIDs = [];
        for (const result of results) {
            listingIDs.push(result.listing_id);
        }
        let query2 = "SELECT * FROM listings WHERE ";
        for (const listingID of listingIDs) {
            query2=query2.concat(`id = ${listingID} OR `);
        }
        query2=query2.slice(0, -4);
        const [results2, fields2] = await connection.query(query2);
        //append listing details to results
        for (const result of results) {
            for (const listing of results2) {
                if (result.listing_id===listing.id){
                    result.listing = listing;
                }
            }
        }

        reply.code(200).send({message: "success", offers: results})
    }
    catch (e){
        reply.code(500).send({message: "internal server error", error: e})
        console.log(e)
    }

}