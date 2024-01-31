export default async function (request, reply){
    const listingId = request.params.id;
    const userId = request.user.userID;
    const {body} = request;
    //check body for ttl, if not found, make it the default, 7 days.
    const ttl = body.ttl || 7;
    if (body.price==null){
        reply.code(400).send({message: "price is required"})
        return
    }
    const price = body.price;


    console.log(ttl);
    try {
        const connection = await this.mysql.getConnection();
        const listingQuery = 'SELECT * FROM listings WHERE id = ?';
        const [results, fields] = await connection.query(listingQuery, [listingId]);
        if (results.length==0){
            reply.code(404).send({message: "listing not found"})
            return;
        }
        if (results[0].creator_id == userId){
            reply.code(400).send({message: "you cannot make an offer on your own listing"})
            return;
        }
        const owner = results[0].creator_id;
        if ('available'.localeCompare(results[0].availability)!==0){
            reply.code(400).send({message: "listing is not available"})
            return;
        }
        const insertQuery = 'INSERT INTO offers (listing_id, bidder_id, amount, validity_duration, owner_id) VALUES (?, ?, ?, ?,?)';
        const [insertRes, insertFields] = await connection.query(insertQuery, [listingId, userId, price, ttl, owner]);
        const offerId = insertRes.insertId;
        reply.code(200).send({message: "success", offerId: offerId})

    }catch (e) {
        reply.code(500).send({message: "internal server error", error: e})
        console.log(e)
    }finally {

    }

};


/*
* CREATE TABLE `offers` (
	`id` int NOT NULL AUTO_INCREMENT,
	`amount` float NOT NULL,
	`validity_duration` int NOT NULL,
	`created_at` datetime DEFAULT current_timestamp(),
	`listing_id` int,
	`bidder_id` int,
	`accepted` tinyint(1),
	`is_valid` tinyint(1) DEFAULT '1',
	PRIMARY KEY (`id`),
	KEY `listing_id` (`listing_id`),
	KEY `offerer_id` (`bidder_id`),
	CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`),
	CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`bidder_id`) REFERENCES `users` (`id`)
)
* //alter table offers add column owner_id int;
*
*
* */