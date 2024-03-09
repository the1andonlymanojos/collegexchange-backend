import getAllListings from './getAllListings.js';
import getListingById from './getListingDetails.js';
import {postListingHandler} from "./postListingHandler.js";
import getAllOffersOnAListing from './getAllOffersOnAListing.js';
import multer from "fastify-multer";
import randomstring from "randomstring";


let options = {
    length: 15,
    charset: 'alphabetic',
    capitalization: 'lowercase'
};//options for random string generation


const storage = multer.diskStorage({

    destination: function (req, file, cb){
        cb(null, './uploads/listings/originals/')
    },

    filename: function (req, file, cb){
        cb(null, randomstring.generate(options)+file.originalname.slice(file.originalname.lastIndexOf('.')))
    }
}) //storage options for multer


const upload = multer({storage}) //multer instance

export default function (fastify, opts, done) {

    fastify.get('/', getAllListings) // implement dynamic query builder, tokenized search, ranking based on number of tokens matched.


    fastify.post('/',
        {
            config:{auth:true},
            preHandler: upload.array('images',10)
        }
    ,postListingHandler) // images, title, description, external link, location, category, price.


    fastify.get('/:id', getListingById) //title, images, description, external link, seller details, offers made by this user, if any and their status.

    fastify.get('/offers/:id',{
        config:{auth:true}
    },getAllOffersOnAListing)

    fastify.put('/:id', (request, reply)=>{
        return{
            message: "editing listing"
        }
    }) // edit a specific listing, identified by id, if the user is the owner of the listing title, description, external link, location, category, price.




    done();
}