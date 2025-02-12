import { Request, Response } from "express";

import { ReviewController } from "./reviews.controller";

export class ReviewView {
  private controller: ReviewController;
  private static instance: ReviewView | null = null;
  private constructor() {
    this.controller = ReviewController.getInstance();
    // Bind all methods to preserve 'this' context
    this.create = this.create.bind(this);
    this.getOneById = this.getOneById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  public static getInstance(): ReviewView {
    if (!ReviewView.instance) {
      ReviewView.instance = new ReviewView();
    }
    return ReviewView.instance;
  }
  async create(req: Request, res: Response) {
    const review = await this.controller.create(req);
    res.send({
      data: review,
      message: req.t("responses.succes"),
    });
  }

  async getOneById(req: Request, res: Response) {
    const review = await this.controller.get(req);
    res.send({
      data: review,
      message: req.t("responses.succes"),
    });
  }

  async getAll(req: Request, res: Response) {
    const reviews = await this.controller.getAll(req);
    res.send({
      data: reviews,
      message: req.t("responses.succes"),
    });
  }

  async update(req: Request, res: Response) {
    const review = await this.controller.update(req);
    res.send({
      data: review,
      message: req.t("responses.succes"),
    });
  }

  async deleteOne(req: Request, res: Response) {
    const review = await this.controller.delete(req);
    res.send({
      data: review,
      message: req.t("responses.succes"),
    });
  }

  //
}
