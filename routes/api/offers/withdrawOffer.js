export default async function (request, reply) {
    const offerID = request.params.id;
    const userID = request.user.userID;
    const connection = await this.mysql.getConnection();
    try {
        //check if offer exists
        const offerQuery = 'SELECT * FROM offers WHERE id = ?';
        const [offerResults, offerFields] = await connection.query(offerQuery, [offerID]);
        if (offerResults.length==0){
            reply.code(404).send({message: "offer not found"})
            return;
        }
        const offer = offerResults[0];
        //check if user is bidder
        if (offer.bidder_id!==userID){
            reply.code(400).send({message: "you are not the bidder"})
            return;
        }
        //check if offer has been accepted
        if (offer.accepted===1){
            reply.code(400).send({message: "offer has been accepted, cannot withdraw. forceful withrdrawl will result in a lower rating"})
            return;
        }
        //check if offer is valid
        if (offer.is_valid===0){
            reply.code(400).send({message: "offer has been withdrawn/expired"})
            return;
        }
        //withdraw offer, set is_valid to 0
        const updateQuery = 'UPDATE offers SET is_valid = 0 WHERE id = ?';
        const [updateResults, updateFields] = await connection.query(updateQuery, [offerID]);
        reply.code(200).send({message: "offer withdrawn"})
} catch (e){
        reply.code(500).send({message: "internal server error", error: e})
    }
}