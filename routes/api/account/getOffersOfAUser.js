export default async function (request, reply){
    const userID = request.user.userID;
    const connection = await this.mysql.getConnection();
    try{

        const offerQuery = 'SELECT o.id, o.amount,o.created_at,o.expires_at,o.listing_id,o.accepted,o.is_valid\n' +
            'FROM offers o\n' +
            'JOIN (\n' +
            '    SELECT listing_id, MAX(created_at) AS latest_created_at\n' +
            '    FROM offers\n' +
            '    WHERE bidder_id = ?\n' +
            '    GROUP BY listing_id\n' +
            ') AS latest_offers\n' +
            'ON o.listing_id = latest_offers.listing_id\n' +
            'AND o.created_at = latest_offers.latest_created_at\n' +
            'WHERE o.bidder_id = ?;\n';
        const [results, fields] = await connection.query(offerQuery, [userID,userID]);
        if (results.length===0){
            reply.code(404).send({message: "no offers found"})
            return;
        }
        //get listing details for each offer, append to results, create list of listing ids first, then query for each listing id.
        let listingIDs = [];
        for (const result of results) {
            listingIDs.push(result.listing_id);
        }
        let query2 = "SELECT      l.id,     l.title,     l.availability,     l.highest_bid,     (SELECT pathOriginal FROM images WHERE id IN (JSON_UNQUOTE(JSON_EXTRACT(l.images, '$[0]')))) AS image_path FROM      listings l WHERE      l.id IN ( ";
        for (const listingID of listingIDs) {
            query2=query2.concat(`${listingID},`);
        }
         query2=query2.slice(0,-1);
        query2=query2.concat(");");
        const [results2, fields2] = await connection.query(query2);
        //append listing details to results
        for (const result of results) {
            for (const listing of results2) {
                if (result.listing_id===listing.id){
                    result.listing = listing;
                }
            }
        }
        console.log(results)
        reply.code(200).send({message: "success", offers: results})
    }
    catch (e){
        reply.code(500).send({message: "internal server error", error: e})
        console.log(e)
    }
    finally {
        connection.release()
    }

}