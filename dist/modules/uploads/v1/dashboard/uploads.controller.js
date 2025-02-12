"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = uploadImages;
exports.deleteImage = deleteImage;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const appError_1 = require("../../../../utils/appError");
async function uploadImages(req, res) {
    if (req.file) {
        const fileUrl = `/uploads/${req.file.filename}`;
        return res.json({ url: fileUrl });
    }
    if (req.files && req.files.length !== 0) {
        const fileUrls = req.files.map((file) => {
            return `/uploads/${file.filename}`;
        });
        return res.json({ urls: fileUrls });
    }
    throw new appError_1.UnprocessableEntityError("No file uploaded.");
}
async function deleteImage(req, res) {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, "../../../../../uploads", filename);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
        return res.json({ message: "File deleted successfully." });
    }
    throw new appError_1.UnprocessableEntityError("File not found.");
}
