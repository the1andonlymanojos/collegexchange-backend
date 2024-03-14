const loginHandler = async function (request, reply){
    const {email, password} = request.body;
    console.log(email, password)
    const connection = await this.mysql.getConnection();
    try{
        const [results, fields] = await connection.query('SELECT * FROM users WHERE email=?', [email]);
        console.log(results)
        if(results.length>0){
            const isMatch = await this.comparePassword(password, results[0].password);
            if(isMatch){
                const token = await this.generateJWT(results[0].id, results[0].email);
                reply.setCookie('jwtToken', token, {path: '/', httpOnly: true, sameSite:"none", expires: new Date(Date.now() + 86400000)})
                reply.code(200).send({
                    message: 'User logged in',
                    token: token,
                    UserObject: {email: email, userID: results[0].userID}
                })
            }
            else{
                reply.code(470).send({message: 'Password is incorrect', error: 'Password is incorrect'});
            }
        }
        else{
            reply.code(469).send({ error: 'User does not exist',message: 'we couldn\'t find any account registered with this email'});
        }
    } catch (error){
        reply.code(500).send({message: 'Internal server error', error: error});
        console.log(error)
    } finally {
        connection.release();
    }


}

const bodyFormatLogin = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {type: 'string'},
        password: {type: 'string'}
    }
}

const replyFormatLogin = {
    200: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            token: {type: 'string'},
            UserObject: {type: 'object', properties: {
                    email: {type: 'string'},
                    userID: {type: 'number'}
                }}
        }
    },
    469: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            error: {type: 'string'}
        }
    },
    470: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            error: {type: 'string'}
        }
    },
    401: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            error: {type: 'string'}
        }
    },
    500: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            error: {type: 'string'}
        }
    }
}

export {loginHandler, bodyFormatLogin, replyFormatLogin};