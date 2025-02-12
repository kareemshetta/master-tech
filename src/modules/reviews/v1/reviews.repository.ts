import { BaseRepository } from "../../../utils/baseRepository";

import Review from "../../../models/review.model";
class ReviewRepository extends BaseRepository<Review> {
  private static instance: ReviewRepository | null = null;

  private constructor() {
    super(Review);
  }

  public static getInstance(): ReviewRepository {
    if (!ReviewRepository.instance) {
      ReviewRepository.instance = new ReviewRepository();
    }
    return ReviewRepository.instance;
  }

  // You can add specific methods for Review repository if needed
}

export default ReviewRepository;
