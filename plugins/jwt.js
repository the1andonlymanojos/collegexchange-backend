import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import 'dotenv';
export default fp(async function (fastify, opts) {
    fastify.decorate('decodeJWT', async function(token){
        try{
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            return decoded
        }catch(err){
            return err
        }
    })
    fastify.decorate('generateJWT', async function(userID, email){
        const payload = {
            userID: userID,
            email: email
        }

        try{
            const token = await jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '1d'})
            return token
        }catch(err){
            return err
        }
    })

})