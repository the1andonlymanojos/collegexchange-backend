export default async function (request, reply) {
    const offerID = request.params.id;
    const userID = request.user.userID;
    const connection = await this.mysql.getConnection();
    if (request.body.accept===false){
        reply.code(400).send({message: "please set accept to true to accept offer"})
        return;
        //rejecting an offer only makes sense when there is a chat feature for negotiation.
        //until then, there is no need to implement this.
    }
    try {
        //check if offer exists
        const offerQuery = 'SELECT * FROM offers WHERE id = ?';
        const [offerResults, offerFields] = await connection.query(offerQuery, [offerID]);
        if (offerResults.length==0){
            reply.code(404).send({message: "offer not found"})
            return;
        }
        const offer = offerResults[0];
        //check if user is listing owner
        if (offer.owner_id!==userID){
            reply.code(400).send({message: "you are not the listing owner"})
            return;
        }
        //get expiry date by adding created_at and validity_duration
        if (offer.is_valid===0){
            reply.code(400).send({message: "offer has been withdrawn/expired"})
            return;
        }
        const expiryDate = new Date(offer.created_at);
        expiryDate.setDate(expiryDate.getDate() + offer.validity_duration);
        //check if offer is expired
        if (expiryDate<new Date()){
            //if yes invalidate offer
            const updateQuery = 'UPDATE offers SET is_valid = 0 WHERE id = ?';
            const [updateResults, updateFields] = await connection.query(updateQuery, [offerID]);
            reply.code(400).send({message: "offer is expired"})
            return;
        }
        //accept offer, set accepted to 1, and set listing availability to unavailable
        const updateQuery = 'UPDATE offers SET accepted = 1 WHERE id = ?';
        const updateAvailability = 'UPDATE listings SET availability = "unavailable" WHERE id = ?';
        const [updateResults, updateFields] = await connection.query(updateQuery, [offerID]);
        const [updateAvailabilityResults, updateAvailabilityFields] = await connection.query(updateAvailability, [offer.listing_id]);
        reply.code(200).send({message: "offer accepted"})
        //setup notification system, and an information exchange pipeline to allow deal to be completed.
        //one idea is to add a transaction table, and when an offer is accepted create a new transaction with contact info of both parties, link
        //this transaction to the offer. send a notification that points users to the getdetailsaboutoffer page,
        //if a transaction id is present, then the frontend can just append the contact info to the page.
        //a button for each party to confirm that the deal is completed, and when both parties confirm, the transaction is deleted.

    }catch (e){
        reply.code(500).send({message: "internal server error", error: e})
    }
    finally {
        await connection.release();
    }

}