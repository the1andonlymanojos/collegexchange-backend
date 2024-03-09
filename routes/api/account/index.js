import { registerHandler, bodyFormatRegister, responseFormatRegister } from './registerNewAccount.js';
import {loginHandler, replyFormatLogin, bodyFormatLogin} from './login.js';
import {getAccountDetailsHandler} from './getAccountDetails.js';
import getListingsMadeByUser from "./getListingsMadeByUser.js";
import {putAccountDetails} from "./putAccountDetails.js";
import  getOffersOfAUser from "./getOffersOfAUser.js";
import multer from "fastify-multer";
import randomstring from "randomstring";

let options = {
    length: 15,
    charset: 'alphabetic',
    capitalization: 'lowercase'
};
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/pfps/')
    },
    filename: function (req, file, cb){
        cb(null, randomstring.generate(options)+file.originalname.slice(file.originalname.lastIndexOf('.')))
    }
})
const upload = multer({storage})
export default async function (fastify, opts){

    fastify.post('/login', {schema: {
        body: bodyFormatLogin,
        response: replyFormatLogin
        }}, loginHandler)           //improve schema
    fastify.post('/register',{schema: {
            body: bodyFormatRegister,
            response: responseFormatRegister
        }}, registerHandler)    //improve schema

    fastify.put('/', {config:{auth:true}, preHandler: upload.single('pfp')} ,putAccountDetails)   //schema missing, improve standardization wrt to vars and response structure

    fastify.get('/',{config: {auth:true}}, getAccountDetailsHandler)              // no schema, improve standardization wrt to vars and response structure


    fastify.get('/offers',{config: {auth:true}}, getOffersOfAUser)   // get all offers made by a user, specifically the user that is logged in// do this after offer table is finalized
    fastify.get('/listings',{config: {auth:true}}, getListingsMadeByUser) //get all listings made by a user
                                                        //do this after listing table is finalized
}

/*
* To do:
* 1. Schema for all routes
* 2. Standardize response structure
* 3. Standardize variable names
* 4. Standardize error messages
* 5. Standardize HTTP status codes
* 7. Standardize error handling
*
* */