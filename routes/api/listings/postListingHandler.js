const postListingHandler = async function (request, reply){
    const userid = request.user.userID;
    const {body} = request
    const files = request.files;
    console.log(files)
    if (!files){
        reply.code(400).send({message: "files are required"})
        return
    }

    const imageIDs=[];

    for (const file of files) {
        const imageID = await this.uploadImageToDB(userid, file.path, file.filename);
        this.processImage(imageID,file.path,'uploads/listings/thumbnails/', {width: 200, height: 200, format: 'png', quality: 85, position: 'center'}, "thumbnail")
        this.processImage(imageID,file.path,'uploads/listings/medium/', {width: 600, height: 600, format: 'png', quality: 85, position: 'center'},"medium")
        imageIDs.push(imageID);
    }
    if (body.title==null){
        reply.code(400).send({message: "title is required"})
        return
    }
    if (body.description==null){
        reply.code(400).send({message: "description is required"})
        return
    }
    if (body.suggestedMinimumBid==null){
        reply.code(400).send({message: "price is required"})
        return
    }
    if (body.categories==null){
        reply.code(400).send({message: "category is required"})
        return
    }
    const descriptionModded = body.description.concat(" TAGS: " + body.categories)
    const insertQuery = 'INSERT INTO listings (title,images, description, suggested_minimum_bid, creator_id) VALUES (?, ?, ?, ?, ?)';
    const values = [body.title, JSON.stringify(imageIDs), descriptionModded, body.suggestedMinimumBid, userid];
    const connection = await this.mysql.getConnection();
    try{
        let [results, fields]= await connection.query(insertQuery, values);
        const listingID = results.insertId;
        console.log(listingID)
        console.log(body.categories)
        const categoryQuery = 'INSERT INTO listing_category (listing_id, category) VALUES (?, ?)';

        let [results2, fields2]= await connection.query(categoryQuery, [listingID, body.categories]);

        reply.code(200).send({message: "success", listingID: listingID})
    }
    catch (err){
        reply.code(500).send({message: "internal server error", error: err})
    }
    finally {
        connection.release();
    }

}



export {postListingHandler}