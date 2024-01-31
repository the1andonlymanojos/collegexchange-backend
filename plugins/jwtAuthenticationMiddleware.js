import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

async function jwtAuthenticationMiddleware(fastify, opts){
    fastify.addHook('preHandler', async function(request, reply){
        const routeOptions = request.routeOptions.config;
        if (routeOptions.auth===true){
            try{
                const token = request.cookies.jwtToken;
                const decoded = await jwt.verify(token, process.env.JWT_SECRET);
                request.user = decoded;
                console.log(decoded)
            }catch(err){
                reply.code(401).send({message: 'Unauthorized', error: err})
            }
        }

    })
}


export default fp(jwtAuthenticationMiddleware)