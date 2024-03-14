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
    reply.setCookie('jwtToken', "manoj is epic", {
      path: '/',
      httpOnly: false,
      sameSite:"lax",
      domain: '127.0.0.1',
      expires: new Date(Date.now() + 86400000)})

    reply.send({ hello: 'world' })
  });

  fastify.get('/cookie-show', async function (request, reply){
    console.log(request.cookies)
    reply.send({cookies: request.cookies, message: "hwllo wowd"})
  })

  fastify.get('/getnew', async function(request, reply){
    const connection = await this.mysql.getConnection();
    try{
      const get10listings = `SELECT * FROM listings where availability='available' ORDER BY id DESC LIMIT 10;`;
      const [results, fields] = await connection.query(get10listings);
      for (const result of results) {
        let query2 = "SELECT pathOriginal,pathThumbnail path FROM images WHERE ";
        for (const image of result.images) {
          query2=query2.concat(`id = ${image} OR `);
        }
        query2=query2.slice(0, -4);
        const [results2, fields2] = await connection.query(query2);
        for (let i = 0; i < results2.length; i++) {
          if (results2[i].pathThumbnail){
            results2[i] = `${results2[i].pathThumbnail}`;
          } else {
          //make urls
          results2[i] = `${results2[i].pathOriginal}`;

          }
          //replace originals with thumbnails for thumbnails
        }
        result.images = results2;
      }
      reply.code(200).send({message: "success", listings: results})


    }catch (e){
      console.log(e)
      reply.code(500).send({message: "Internal server error"})
    } finally {
      connection.release();
    }

  })
}
