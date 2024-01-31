export default async function (request, reply){
    const offerID = request.params.id;
    const userID = request.user.userID;
    try{
        const connection = await this.mysql.getConnection();
        const offerQuery = 'SELECT * FROM offers WHERE id = ?';
        const [results, fields] = await connection.query(offerQuery, [offerID]);
        if (results.length==0){
            reply.code(404).send({message: "offer not found"})
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
}