import sharp from 'sharp';

const pathToPNG = "./testimages/img.png";
const pathToJPG = "./testimages/test1.jpg";
const pathToHEIC = "./testimages/test2.HEIC";

const opts = {width: 600, height: 600, format: 'png', quality: 85, position: 'center'}

let PNGimg = sharp(pathToPNG);
let JPGimg = sharp(pathToJPG);
let HEICimg = sharp(pathToHEIC);

PNGimg=PNGimg.resize(600,600,{position: 'centre'} ).toFormat('png', {quality: 85});
JPGimg=JPGimg.resize(600,600,{position: 'centre'} ).toFormat('png', {quality: 85});
HEICimg=HEICimg.resize(600,600,{position: 'centre'} ).toFormat('png', {quality: 85});

PNGimg.toFile("./testimages/img600x600.png");
JPGimg.toFile("./testimages/test1600x600.png");
HEICimg.toFile("./testimages/test2600x600.png");

/*
pathThumbnail
pathMedium
pathOriginal
*/

