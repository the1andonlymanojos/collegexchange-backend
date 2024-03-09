

const registerHandler = async function  (request, reply){
    console.log('register handler')
    const {email, password, username, phoneNumber} = request.body;
    const hashedPassword = await this.hashPassword(password);
    console.log(email, hashedPassword, username, phoneNumber);
    const {mysql} = this;
    const connection = await this.mysql.getConnection();
    try{
    const [results, fields] = await connection.query('SELECT * FROM users WHERE email=?', [email]);
    console.log(results)
    if(results.length>0){
        reply.code(409).send({message: 'User already exists', error: 'User already exists'});
    }
    else {
        const [results, fields] = await connection.query('INSERT INTO users (email, password, name, phone_number) VALUES (?, ?, ?, ?)', [email, hashedPassword, username, phoneNumber]);
        console.log(results)
        const token = await this.generateJWT(results.insertId, email);
        reply.setCookie('jwtToken', token, {path: '/',
        httpOnly: true,
            expires: new Date(Date.now() + 86400000)
        })
        reply.code(201).send({
            message: 'User created',
            token: token,
            UserObject: {email: email, userID: results.insertId}
        })
    }
    } catch (e){
        console.log(e)
        reply.code(500).send({message: 'Internal server error', error: e});

    }
    finally {
        connection.release();

    }
}

const bodyFormatRegister={
    type: 'object',
    required: ['email', 'password', 'username', 'phoneNumber'],
    properties: {
        email: {type: 'string'},
        password: {type: 'string'},
        username: {type: 'string'},
        phoneNumber: {type: 'string', minLength: 10, maxLength:10},
    }
}

 const responseFormatRegister={
    201: {
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
    409: {
        type: 'object',
        properties: {
            message: {type: 'string'},
            error: {type: 'string'}
        }
    }

 }

 export {registerHandler, bodyFormatRegister, responseFormatRegister};