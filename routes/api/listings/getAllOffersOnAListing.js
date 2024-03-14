export default async function (request, reply){
    const listingID = request.params.id;
    const connection = await this.mysql.getConnection();
    try{
        const listingQuery = `SELECT
    l.id,
    l.title,
    l.location,
    l.suggested_minimum_bid,
    l.description,
    l.ext_link,
    l.creator_id,
    l.availability,
    l.highest_bid,
    (SELECT i.pathThumbnail as pathOriginal FROM images i WHERE JSON_CONTAINS(l.images, CAST(i.id AS JSON), '$') LIMIT 1) AS image_path
FROM
    listings l 
    where l.id = ?;`;
        const [results1, fields1] = await connection.query(listingQuery, [listingID]);
        if (results1.length==0){
            reply.code(404).send({message: "listing not found"})
            return;
        }
        if (results1[0].creator_id!==request.user.userID){
            reply.code(403).send({message: "you are not authorized to view offers on this listing"})
            return;
        }
        const offerQuery = 'SELECT * FROM offers WHERE listing_id = ? and is_valid = 1';
        const [results, fields] = await connection.query(offerQuery, [listingID]);
        if (results.length==0){
            reply.code(200).send({message: "success", listing: results1[0]})
            return;
        }
        reply.code(200).send({message: "success", offers: results, listing: results1[0]})
    }
    catch (e){
        reply.code(500).send({message: "internal server error", error: e})
        console.log(e)
    }
    finally {
        connection.release()
    }

}