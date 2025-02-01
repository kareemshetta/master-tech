import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { MulterRequest } from "../../../../utils/shared.types";
import { UnprocessableEntityError } from "../../../../utils/appError";

export async function uploadImages(req: MulterRequest, res: Response) {
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

  throw new UnprocessableEntityError("No file uploaded.");
}

export async function deleteImage(req: Request, res: Response) {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../../../../uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ message: "File deleted successfully." });
  }

  throw new UnprocessableEntityError("File not found.");
}
