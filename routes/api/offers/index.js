import postOffer from "./postOffer.js";
import getOffer from "./getOffer.js";
import getOffers from "./getOffers.js";
import acceptOffer from "./acceptOffer.js";
import withdrawOffer from "./withdrawOffer.js";
export default function(fastify, opts, done){

    fastify.get('/:id',{config:{auth: true}}, getOffer) // get offer for a listing, if user is either bidder or listing owner.

    fastify.post('/create/:id',{config:{auth: true}}, postOffer); // create offer,

    fastify.post('/respond/:id', {config:{auth: true}}, acceptOffer) // accept offer, if user is listing owner.

    fastify.post('/withdraw/:id', {config:{auth: true}}, withdrawOffer ) // withdraw offer, if user is bidder.

    fastify.get('/listing/:id', {config:{auth: true}}, getOffers) // get all offers on a specific listing, user is bidder

    done();
}