



const putAccountDetails =  async function (request, reply){
    const jwtPayload = request.user
    const {body} = request
    const {file} = request
    const connection = await this.mysql.getConnection();
    try{
        const updatedFields = [];
        if (file) {
            // let [results, fields] = await connection.query('insert into images (uploader_id, path, file_name) values (?,?,?)', [jwtPayload.userID, file.path, file.filename])
            // const imageID = results.insertId;
            // console.log(imageID)
            const imageID = await this.uploadImageToDB(jwtPayload.userID, file.path, file.filename);
            await connection.query('update users set pfp=? where id=?', [imageID, jwtPayload.userID])
            updatedFields.push('pfp')
        }
        if (body.name){
            await connection.query('update users set name=? where id=?', [body.name, jwtPayload.userID])
            updatedFields.push('name')
        }
        if (body.phoneNumber){
            await connection.query('update users set phone_number=? where id=?', [body.phoneNumber, jwtPayload.userID])
            updatedFields.push('phoneNumber')
        }
        if (body.email){
            await connection.query('update users set email=? where id=?', [body.email, jwtPayload.userID])
            updatedFields.push('email')
        }

        reply.code(200).send({message: "success"})
    }
    catch(err){
        console.log(err)
        reply.code(500).send({message: "internal server error", error: err})
    }
    finally {
        connection.release()
    }
}

export {putAccountDetails}
