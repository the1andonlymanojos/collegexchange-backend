export default async function (request, reply){
    const userID = request.user.userID;
    const listingID = request.params.id;
    const connection = await this.mysql.getConnection();
    try{
        const offerQuery = 'SELECT * FROM offers WHERE listing_id = ? and bidder_id = ? and is_valid = 1';
        const [results, fields] = await connection.query(offerQuery, [listingID, userID]);
        if (results.length==0){
            reply.code(460).send({message: "offer not found"})
            return;
        }
        if (userID!==results[0].bidder_id && userID!==results[0].owner_id){
            reply.code(403).send({message: "you are not authorized to view this offer"})
            return;
        }
        reply.code(200).send({message: "success", offer: results[0]})
    }
    catch (e){
        reply.code(500).send({message: "internal server error", error: e})
        console.log(e)
    }
    finally {
        connection.release()
    }
}