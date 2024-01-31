import getAllListings from './getAllListings.js';
import getListingById from './getListingDetails.js';
import {postListingHandler} from "./postListingHandler.js";
import multer from "fastify-multer";
import randomstring from "randomstring";
let options = {
    length: 15,
    charset: 'alphabetic',
    capitalization: 'lowercase'
};
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/listings/originals')
    },
    filename: function (req, file, cb){
        cb(null, randomstring.generate(options)+file.originalname.slice(file.originalname.lastIndexOf('.')))
    }
})
const upload = multer({storage})
export default function (fastify, opts, done) {
    fastify.get('/', getAllListings) // implement dynamic query builder, tokenized search, ranking based on number of tokens matched.
    fastify.post('/',{config:{auth:true},
    preHandler: upload.array('images',5)},postListingHandler) // images, title, description, external link, location, category, price.


    fastify.get('/:id',{config:{auth:true}}, getListingById) //title, images, description, external link, seller details, offers made by this user, if any and their status.
    fastify.put('/:id', (request, reply)=>{
        return{
            message: "editing listing"
        }
    }) // edit a specific listing, identified by id, if the user is the owner of the listing title, description, external link, location, category, price.

    done();
}