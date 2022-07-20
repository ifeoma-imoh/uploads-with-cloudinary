import multer from "multer";
import { uploadStream, chunkedUpload, uploadDefault } from '../../uploadFunctions'

const storage = multer.memoryStorage();
const upload = multer({ storage });

const myUploadMiddleware = upload.single("my_file");
function runMiddleware(fn, req, res) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const handler = async (req, res) => {
  try {
    await runMiddleware(myUploadMiddleware, req, res);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    let cldRes = await uploadStream(req.file.buffer, res);
    switch (req.body.upload_func) {
      case "upload_stream": {
        cldRes = await uploadStream(req.file.buffer);
        break;
      }
      case "upload_large": {
        cldRes = await chunkedUpload(dataURI);
        break;
      }
      default: {
        cldRes = await uploadDefault(dataURI);
      }
    }
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
};
export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};