import fp from 'fastify-plugin'
import sharp from 'sharp';
const functions = async function (fastify, opts) {


    fastify.decorate('processImage', async function (imageID, pathToOriginal, pathToProcessed, options, qual) {
    try {
      let image = sharp(pathToOriginal);
console.log("here");
      if (options.width && options.height) {
        image = image.resize(options.width, options.height, {
          position: options.position || 'centre'
        });
      }
      console.log("resize done");
      if (options.format) {
        image = image.toFormat(options.format, {
          quality: options.quality || 80
        });
      }
      console.log("format done");

      const p=pathToProcessed+pathToOriginal.slice(pathToOriginal.lastIndexOf('/')+1);
      console.log(p);
      await image.toFile(p);
      console.log("toFile done");
        if (qual==="thumbnail"){
            await this.insertPathToDB(imageID, p, "pathThumbnail");
        }
        else if (qual==="medium"){
            await this.insertPathToDB(imageID, p, "pathMedium");
        }

      return true;
    } catch (err) {
      return err;
    }
  })

    fastify.decorate('insertPathToDB', async function (imageID, pathToProcessed, dstCol){
        const connection = await this.mysql.getConnection();
        console.log(imageID, pathToProcessed, dstCol, "here")
        try {
            const [results, fields] = await connection.query(
                `update images set ${dstCol}=? where id=?`,
                [ pathToProcessed, imageID]
            );
            console.log(results);
            return results.insertId;
        } catch (err) {
            console.log(err);
            return err;
        } finally {
            connection.release();
        }
    })




    fastify.decorate('uploadImageToDB', async function (userID, filePath, fileName) {
        const connection = await this.mysql.getConnection();

        try {
            // Insert image into the images table
            const [results, fields] = await connection.query(
                'INSERT INTO images (uploader_id, pathOriginal, file_name) VALUES (?, ?, ?)',
                [userID, filePath, fileName]
            );

            const imageID = results.insertId;

            return imageID;
        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            connection.release();
        }
    });

}
export default fp(functions);


//options = {width: 200, height: 200, format: 'png', quality: 80, position: 'centre'}