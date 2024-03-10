import getTransaction from './getTransaction.js';
export default function (fastify, opts, done){
    fastify.get('/:id', {config:{auth: true}}, getTransaction) // get transaction details, if user is either buyer or seller.
    done();
}