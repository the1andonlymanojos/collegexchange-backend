import postOffer from "./postOffer.js";
import getOffers from "./getOffer.js";
import acceptOffer from "./acceptOffer.js";
import withdrawOffer from "./withdrawOffer.js";
export default function(fastify, opts, done){

    fastify.get('/:id',{config:{auth: true}}, getOffers) // get offer for a listing, if user is either bidder or listing owner.

    fastify.post('/create/:id',{config:{auth: true}}, postOffer); // create offer,

    fastify.post('/respond/:id', {config:{auth: true}}, acceptOffer) // accept offer, if user is listing owner.

    fastify.post('/withdraw/:id', {config:{auth: true}}, withdrawOffer ) // withdraw offer, if user is bidder.


    done();
}