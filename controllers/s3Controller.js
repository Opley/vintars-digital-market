const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const dotenv = require("dotenv");
const aws = require("aws-sdk");
const { Products } = require("../models/Products");
const AppError = require("../utils/appError");

// const sharp = require("sharp");

//=============== AWS s3 config
dotenv.config({ path: "./config.env" });

//aws parameters
const region = "ap-northeast-2";
const bucketName = "vintarsdigitalmarket";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

// init s3
const s3 = new aws.S3();

// generate image upload link
const generateUrl = async (req, res) => {
  let date = new Date();
  let id = parseInt(Math.random() * 1000000000);

  const imageName = `${id}${date.getTime()}.jpg`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    // Expires: 3000, //300ms
    ContentType: "image/jpeg",
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  res.json(uploadUrl);
};

const uploadImgs = async (req, res) => {};

const resizeImg = async (req, res, next) => {
  const files = req.files;
  // console.log("files:", req.files);
  // console.log("body:", req.body.link);

  // const t = [];
  // files.forEach((f) => {
  //   const [file] = f.transforms;
  //   console.log(file.location);
  //   t.push(file.location);
  // });

  // return res.status(200).json(t);

  // files.transforms.forEach((file) => {
  //   console.log(file.location);
  // });
  // next();

  // console.log("sending response to the s3url post request");
  // // if (!req.file) return next();
  // const images = req.files;
  // let { urls } = req.body;
  // if (!Array.isArray(urls)) {
  //   urls = [urls];
  // }
  // const result = await images.map(async (img, i) => {
  //   const { orientation } = await sharp(img.buffer).metadata();
  //   const blankImg = await sharp(img.buffer).toBuffer();
  //   return await sharp(blankImg)
  //     .withMetadata({ orientation })
  //     .resize(500, undefined, {
  //       fit: "contain",
  //     })
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toBuffer();
  // fetch(urls[i], {
  //   method: "PUT",
  //   headers: new Headers({ "Content-Type": "multipart/form-data" }),
  //   body: image,
  // });
  // });
  // const t = await Promise.all(result);
  // console.log(t);
  // res.status(200).json({ status: "success", t });
  // urls.forEach((url, i) => {
  //   fetch(url, {
  //     method: "PUT",
  //     headers: new Headers({ "Content-Type": "multipart/form-data" }),
  //     body: req.files[i],
  //   });
  // });
  // let count = 0;
  // uploadImgs.map((img) => {
  //   let date = new Date();
  //   const user = req.user;
  //   const imageName = `${user.email}${date.getTime()}.jpg`;
  //   const params = {
  //     Bucket: bucketName,
  //     Key: imageName,
  //     Body: img,
  //   };
  //   s3.upload(params, function (err, data) {
  //     if (err) {
  //       console.log("Error uploading data: ", err);
  //     } else {
  //       count++;
  //       console.log("Successfully uploaded data to myBucket/myKey");
  //     }
  //   });
  // });
  // return res.status(200).json({ urls });
  // const fs = require("fs");
  // const imgBinary = req.file.buffer.toString("binary");
  // const test = piexif.load(imgBinary);
  // function debugExif(exif) {
  //   for (const ifd in exif) {
  //     if (ifd == "thumbnail") {
  //       const thumbnailData = exif[ifd] === null ? "null" : exif[ifd];
  //       console.log(`- thumbnail: ${thumbnailData}`);
  //     } else {
  //       console.log(`- ${ifd}`);
  //       for (const tag in exif[ifd]) {
  //         console.log(
  //           `    - ${piexif.TAGS[ifd][tag]["name"]}: ${exif[ifd][tag]}`
  //         );
  //       }
  //     }
  //   }
  // }
  // console.log(debugExif(test));
};

// const multerStorage = multer.memoryStorage();

// const params = {
//   Bucket: bucketName,
//   Key: imageName,
//   // Expires: 3000, //300ms
//   ContentType: "image/jpeg",
// };
const formValidation = (product) => {
  if (
    !product.name ||
    !product.briefDes ||
    !product.detailedDes ||
    !product.price
  )
    return "Please fill out all required fields";

  return;
};

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    key: function (req, file, cb) {
      //prettier-ignore
      cb(null, req.user.email + Date.now() + parseInt(Math.random() *10000000000) + ".jpg");
    },
    // TODO ==> figure out a way to rename the image
    // and add type to amazon s3

    // shouldTransform: function (req, file, cb) {
    //   console.log("uploaded this file: ", file);
    //   const product = JSON.parse(req.body.product);
    //   if (formValidation(product)) return cb("fields");
    //   console.log(file.mimetype);
    //   cb(null, /^image/i.test(file.mimetype));
    // },
    // transforms: [
    //   {
    //     id: "original",
    //     key: function (req, file, cb) {
    //       //prettier-ignore
    //       cb(null, req.user.email + Date.now() + parseInt(Math.random() *10000000000) + ".jpg");
    //     },
    // transform: async function (req, file, cb) {
    //   console.log(file, "💥💥💥");
    //   //Perform desired transformations
    //   cb(
    //     null,
    //     sharp()
    //       .resize(500, undefined, { fit: "contain" })
    //       .jpeg({ quality: 90 })
    //       .toFormat("jpeg")
    //       .withMetadata()

    //     // .toBuffer()
    //     // .withMetadata({ orientation })
    //   );
    // },
    // },
    // ],
  }),
});

const uploadUserPhoto = (req, res, next) => {
  console.time();
  upload.fields([
    { name: "product", maxCount: 1 },
    { name: "files", maxCount: 4 },
  ])(req, res, async (error) => {
    let product = JSON.parse(req.body.product);
    const errorMsg = formValidation(product);
    console.log(error);

    if (errorMsg) {
      return next(new AppError("FILE_UPLOAD_ERROR", errorMsg, 404));
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        message: "Upload unsuccessful",
        errorMessage: error.message,
        errorCode: error.code,
      });
    }

    if (error) {
      return next(
        new AppError("FILE_UPLOAD_ERROR", `Please fill out the: ${error}`, 400)
      );
    }
    if (Object.keys(req.files).length === 0 && !product.id) {
      return next(
        new AppError("FILE_UPLOAD_ERROR", "Please upload an image!", 400)
      );
    }
    console.log("Upload successful...");

    const { files } = req.files || null;
    if (files) {
      files.forEach((file) => {
        // const [tempFiles] = file.transforms;
        // product.imagePaths.push(tempFiles.location);
        console.log(file);
        const location = file.location;
        product.imagePaths.push(location);
      });
    }

    product.email = req.user.email;
    product.owner = req.user.email;

    if (product.id) {
      product = await Products.findOneAndUpdate(
        { _id: product.id },
        {
          $set: {
            name: product.name,
            briefDes: product.briefDes,
            detailedDes: product.detailedDes,
            imagePaths: product.imagePaths,
            sizes: product.sizes,
            stocks: product.stocks,
            price: product.price,
          },
        }
      );
    } else {
      await Products.create(product);
    }

    console.timeEnd();
    console.log("Product created... or updated..");
    return res
      .status(200)
      .json({ status: "success", message: "Product has been created..." });
  });
};

const deleteImg = async (req, res, next) => {
  const product = req.product;

  const images = [];

  product.imagePaths.forEach((img) => {
    if (!img) return;
    const image = img.split(".com/")[1].replace("%40", "@");
    images.push({ Key: image });
  });

  var deleteParam = {
    Bucket: bucketName,
    Delete: {
      Objects: images,
    },
  };
  s3.deleteObjects(deleteParam, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });

  return res
    .status(200)
    .json({ status: "success", message: "product has been deleted" });
};

const deleteS3Object = async (req, res, next) => {
  const { object } = req.body;
  const img = object.split(".com/")[1].split(`")`)[0].replace("%40", "@");

  var deleteParam = {
    Bucket: bucketName,
    Key: img,
  };

  s3.deleteObject(deleteParam, (err, data) => {
    if (err) {
      console.log("there was an error");
    } else {
      console.log("deleted");
    }
  });
};

module.exports = {
  generateUrl,
  uploadImgs,
  resizeImg,
  uploadUserPhoto,
  deleteImg,
  deleteS3Object,
};
