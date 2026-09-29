import ImageKit ,{toFile} from '@imagekit/nodejs';
import config from '../config/config.js';

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
   
});
// @description upload image to imagekit
// @params {object} param 0
// @params {buffer} param 0.buffer  - the file buffer to be uploaded
// @params {string} param 0.fileName - the file name to be uploaded
// @returns {object} response - the response from imagekit after uploading the file

export async function uploadImage({buffer,fileName}){
    const response = await client.files.upload({
        file :await toFile(buffer),
        fileName :fileName,
        folder:"snitch"
    })
    return response;
}