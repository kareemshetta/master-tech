"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidation = exports.upload = exports.uploadImages = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const appError_1 = require("./appError");
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY || "";
const region = process.env.AWS_S3_REGION || "";
const bucketName = process.env.AWS_S3_BUCKET_NAME || "";
// Configure AWS S3 client
// export const s3 = new S3Client({
//   region: region,
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
// });
// const s3Storage = multerS3({
//   s3: s3,
//   bucket: bucketName,
//   acl: "public-read",
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     const timestamp = Date.now();
//     const randomSuffix = Math.floor(Math.random() * 10000);
//     const fileName = `uploads/image-${timestamp}-${randomSuffix}${path.extname(
//       file.originalname
//     )}`;
//     cb(null, fileName);
//   },
// });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 10000);
        const fileName = `image-${timestamp}-${randomSuffix}${path_1.default.extname(file.originalname)}`;
        cb(null, fileName);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".HEIF", ".svg"];
    const isValidExtension = allowedExtensions.includes(path_1.default.extname(file.originalname).toLowerCase());
    if (isValidExtension) {
        cb(null, true);
    }
    else {
        cb(new appError_1.UnprocessableEntityError("Invalid file extension. Only JPG, JPEG, PNG, and SVG are allowed."));
    }
};
exports.uploadImages = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit
});
exports.fileValidation = {
    image: [
        "image/jpeg",
        "image/png",
        // "image/gif",
        "image/jpg",
        "image/svg+xml",
        // "image/bmp",
        // "image/webp",
        // "image/tiff",
        // "image/apng",
        // "image/x-icon",
        // "image/vnd.microsoft.icon",
        "image/heif",
        // "image/heic",
        // "image/jp2",
        // "image/jxr",
        // "image/pjpeg",
        // "image/x-jng",
    ],
    file: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/octet-stream",
    ],
    excel: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    ],
    imageOrFile: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
        "image/svg+xml",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/octet-stream",
    ],
    imageOrPdf: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
        "image/svg+xml",
        "application/pdf",
        "application/octet-stream",
    ],
};
// export const uploadAny = (customValidation: string[]) => {
//   const fileFilter = (req: Request, file: any, cb: any) => {
//     if (customValidation.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(
//         new UnprocessableEntityError(
//           `In-valid file format only these formats are allowed ${customValidation.join(
//             "-"
//           )}`
//         )
//       );
//     }
//   };
//   return multer({
//     storage: s3Storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 20 * 1024 * 1024 }, // 5 MB limit
//   });
// };
// export async function removeImageFromS3(imageKey: string) {
//   try {
//     const deleteCommand = new DeleteObjectCommand({
//       Bucket: bucketName,
//       Key: imageKey,
//     });
//     console.log(`Image ${imageKey} deleted from ${bucketName} bucket.`);
//     return await s3.send(deleteCommand);
//   } catch (error) {
//     console.error(
//       `Error deleting image ${imageKey} from ${bucketName} bucket:`,
//       error
//     );
//     throw error;
//   }
// }
// export async function removeImagesFromS3(imageKeys: string[]) {
//   try {
//     const deleteCommand = new DeleteObjectsCommand({
//       Bucket: bucketName,
//       Delete: {
//         Objects: imageKeys.map((key) => ({ Key: key })),
//       },
//     });
//     const response = await s3.send(deleteCommand);
//     console.log(
//       `Deleted ${response.Deleted?.length} images from ${bucketName} bucket.`
//     );
//     // Check for any errors in the DeleteObjectsCommand response
//     if (response.Errors && response.Errors.length > 0) {
//       response.Errors.forEach((error) => {
//         if (error.Code === "NoSuchKey") {
//           console.log(
//             `Image ${error.Key} not found in ${bucketName} bucket. It may have already been deleted.`
//           );
//         } else {
//           console.error(
//             `Error deleting image ${error.Key} from ${bucketName} bucket:`,
//             error
//           );
//         }
//       });
//     }
//   } catch (error) {
//     console.error(`Error deleting images from ${bucketName} bucket:`, error);
//     throw error;
//   }
// }
