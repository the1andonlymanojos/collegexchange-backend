
/*
CREATE TABLE questions (
    ->     id INT AUTO_INCREMENT PRIMARY KEY,
    ->     listing_id INT NOT NULL,
    ->     user_id INT NOT NULL,
    ->     question TEXT NOT NULL,
    ->     answer TEXT,
    ->     answered BOOLEAN DEFAULT 0,
    ->     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ->     FOREIGN KEY (listing_id) REFERENCES listings(id),
    ->     FOREIGN KEY (user_id) REFERENCES users(id)
    -> );
    */
export default function(fastify, opts, done){

    fastify.post('/:listingID',{config:{auth:true}},
        async function (request, reply){
            const connection = await this.mysql.getConnection();
            const {question} = request.body;
            const {userID} = request.user;
            const {listingID} = request.params;
            if (question==null){
                reply.code(400).send({message: "Question is required."})
                return
            }
            try {
                const [results, fields] = await connection.query(
                    'INSERT INTO questions (listing_id, user_id, question) VALUES (?, ?, ?)',
                    [listingID, userID, question]
                );
                return reply.code(201).send({message:"SUCCESS", questionID:results.insertId})
            } catch (err) {
                console.log(err)
                reply.code(500).send({message:"Error",error:err})
                return err;
            } finally {
                connection.release();
            }

        }
    )//create question on listing with id listingID

    fastify.post('/answer/:id',{config:{auth:true}}, async function(request, reply){
        const connection = await this.mysql.getConnection();
        const {id} = request.params;
        const {answer} = request.body;
        const {userID} = request.user;
        try {
            const getListingOwnerIDQuery = 'SELECT creator_id FROM listings WHERE id = (SELECT listing_id FROM questions WHERE id = ?)';
            const [results1, fields1] = await connection.query(getListingOwnerIDQuery, [id]);
            if (results1[0].creator_id !== userID){
                reply.code(403).send({message:"You do not have permission to answer this question."})
                return
            }
            const [results, fields] = await connection.query(
                'UPDATE questions SET answer = ?, answered = 1 WHERE id = ?',
                [answer, id]
            );
            return reply.code(200).send({message:"SUCCESS"})
        } catch (err) {
            console.log(err)
            reply.code(500).send({message:"Error",error:err})
            return err;
        } finally {
            connection.release();
            //nohup ./startBackend.sh >> /home/ubuntu/bendsh.log 2>&1 &
        }
    })

    fastify.get('/:listingID',async function(request,reply){
        const connection = await this.mysql.getConnection();
        const {listingID} = request.params;
        try {
            const [results, fields] = await connection.query(
                'SELECT * FROM questions WHERE listing_id = ? sort by created_at DESC',
                [listingID]
            );
            return reply.code(200).send({message:"SUCCESS", questions:results})
        } catch (err) {
            console.log(err)
            reply.code(500).send({message:"Error",error:err})
            return err;
        } finally {
            connection.release();
        }

    }) //return all questions on listing with id listingID

    fastify.put('/:id',{config:{auth:true}}, ()=>{
        return "Not implemented"
    }) //edit question with id id, questions.user_id must be equal to request.user.userID
    fastify.delete('/:id',{config:{auth:true}}, ()=>{
        return "Not implemented"
    }) //delete question with id id, questions.user_id must be equal to request.user.userID or listing owner

    done();
}