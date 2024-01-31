export default async function(request, reply){
    console.log(request.user)
    const userid = request.user.userID;

    try {
        const connection = await this.mysql.getConnection();
        let [results, fields] = await connection.query('select * from listings where creator_id=?',[userid]);
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

}