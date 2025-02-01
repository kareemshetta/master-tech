import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { uploadImages } from "../../../../utils/upload";
import * as controller from "./uploads.controller";
const uploadRoutes = Router();

uploadRoutes
  .route("/image")
  .post(
    asyncWrapper(uploadImages.single("image")),
    asyncWrapper(controller.uploadImages)
  );

uploadRoutes
  .route("/images")
  .post(
    asyncWrapper(uploadImages.array("images")),
    asyncWrapper(controller.uploadImages)
  );

uploadRoutes.route("/:filename").delete(asyncWrapper(controller.deleteImage));

export default uploadRoutes;
