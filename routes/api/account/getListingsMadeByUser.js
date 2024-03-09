export default async function(request, reply){
    console.log(request.user)
    const userid = request.user.userID;
    const connection = await this.mysql.getConnection();

    //change pathOriginal to pathThumbnail
    try {
        const query = `
SELECT
    l.id,
    l.title,
    l.location,
    l.suggested_minimum_bid,
    l.description,
    l.ext_link,
    l.creator_id,
    l.availability,
    l.highest_bid,
    (SELECT i.pathOriginal FROM images i WHERE JSON_CONTAINS(l.images, CAST(i.id AS JSON), '$') LIMIT 1) AS image_path
FROM
    listings l 
    WHERE l.creator_id=?;`
        let [results, fields] = await connection.query(query,[userid]);
        console.log(results);
        if (results.length === 0){
            reply.code(200).send({message: 'No listings found'});
            return;
        }
        reply.code(200).send({message: 'Listings fetched', listings: results});
    } catch (e) {
        console.log(e);
       // reply.code().send({message: 'Internal server error', error: e});
        reply.code(500).send({message: 'Internal server error', error: e});
    }
    finally {
        connection.release();
    }

}