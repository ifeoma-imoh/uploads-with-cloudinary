const cloudinary = require("cloudinary").v2;
cloudinary.config();

const options = {
  resource_type: "auto"
};

export async function uploadDefault(dataURI) {
  return cloudinary.uploader.upload(dataURI, options);
}

const { Readable } = require("stream");
export async function uploadStream(buffer) {
  return new Promise((res, rej) => {
    const streamUpload = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) return rej(err);
        res(result);
      }
    );
    let str = Readable.from(buffer);

    str.pipe(streamUpload);
  });
}

export async function chunkedUpload(dataURI) {
  return cloudinary.uploader.upload_large(dataURI, options);
}
