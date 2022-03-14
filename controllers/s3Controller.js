const dotenv = require("dotenv");
const aws = require("aws-sdk");

//=============== AWS s3 config
dotenv.config({ path: "./config.env" });

//aws parameters
const region = "eu-central-1";
const bucketName = "vintar-digital-market";
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
    Expires: 3000, //300ms
    ContentType: "image/jpeg",
  };
  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  res.json(uploadUrl);
};

module.exports = { generateUrl };
