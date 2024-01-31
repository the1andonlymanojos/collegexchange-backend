import fp from 'fastify-plugin'
import bcrypt from 'bcrypt'
import 'dotenv';

export default fp(async function (fastify, opts){
    fastify.decorate('hashPassword', async function(password,saltNum=10){
        try{
            const salt = await bcrypt.genSalt(saltNum)
            const hash = await bcrypt.hash(password, salt)
            return hash
        }catch(err){
            return err
        }
    })
    fastify.decorate('comparePassword', async function(password, hash){
        try{
            const isMatch = await bcrypt.compare(password, hash)
            return isMatch
        }catch(err){
            return err
        }
    })
})