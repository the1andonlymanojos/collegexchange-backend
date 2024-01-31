const getAccountDetailsHandler = async function (request, reply) {
    const userid = request.user.userID;
    console.log(userid)
    const connection = await this.mysql.getConnection();
    try {
        let [results, fields] = await connection.query('select  * from users where id=?',[userid])
        console.log(results)
        //pfp
        if (results[0].pfp !== null){
            let [results2, fields2] = await connection.query('select * from images where id=?',[results[0].pfp])
            console.log(results2)
            results[0].pfp = results2[0].path
        }
        reply.code(200).send({message: 'User details fetched', name: results[0].name, email: results[0].email, phoneNumber: results[0].phone_number, pfp: results[0].pfp});
    }
    catch (error){
        reply.code(500).send({message: 'Internal server error', error: error});
    }
    finally {
        connection.release();
    }
}

export {getAccountDetailsHandler}