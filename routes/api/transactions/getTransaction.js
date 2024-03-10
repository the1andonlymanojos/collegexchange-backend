export default async function (request, reply){
    const transactionID = request.params.id;
    const userID = request.user.userID;
    const connection = await this.mysql.getConnection();
    try{
        const transactionQuery = `SELECT
    s.name AS seller_name,
    s.email AS seller_email,
    s.id AS seller_id,
    s.phone_number AS seller_phone,
    b.name AS buyer_name,
    b.id AS buyer_id,
    t.seller_transaction_complete,
    t.buyer_transaction_complete,
    o.amount AS offer_amount,
    b.email AS buyer_email,
    b.phone_number AS buyer_phone,
    l.title AS listing_title,
    (SELECT i.pathOriginal FROM images i WHERE JSON_CONTAINS(l.images, CAST(i.id AS JSON), '$') LIMIT 1) AS image_path
FROM
    transactions t
JOIN
    users s ON t.seller_id = s.id
JOIN
    users b ON t.buyer_id = b.id
JOIN
    listings l ON t.listing_id = l.id
JOIN offers o ON t.offer_id = o.id
WHERE
    t.id = ${transactionID};
`
        const [results, fields] = await connection.query(transactionQuery, [transactionID]);
        if (results.length==0){
            reply.code(404).send({message: "transaction not found"})
            return;
        }
        if (userID!==results[0].buyer_id && userID!==results[0].seller_id){
            reply.code(403).send({message: "you are not authorized to view this transaction"})
            return;
        }

        reply.code(200).send({message: "success", transaction: results[0]})
    }
    catch (e){
        reply.code(500).send({message: "internal server error", error: e})
        console.log(e)
    }
    finally {
        connection.release();
    }
}