import multer from "fastify-multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './uploads/')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname+ '-' + Date.now()+file.originalname.slice(file.originalname.lastIndexOf('.')))
  }
})

const upload = multer({storage})
export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    reply.send({ hello: 'world' })
  });
}
