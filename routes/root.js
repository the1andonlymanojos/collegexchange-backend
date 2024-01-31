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
  fastify.get('/',{config: {auth: true}}, async function (request, reply) {
   const connection = await this.mysql.getConnection();
    let [results, fields] = await connection.query('select * from listings')
    let idk = results[0].images
    console.log(idk.length)

    reply.send({message: "hello world", results, fields})

  })
  fastify.get('/image', async function (request, reply) {
    await reply.sendFile('/image.png')
  })
  fastify.post('/login', async function (request, reply) {
    return { message: "login page" }
  })
  fastify.post('/register', async function (request, reply) {
    return { message: "register page" }
  })
}
