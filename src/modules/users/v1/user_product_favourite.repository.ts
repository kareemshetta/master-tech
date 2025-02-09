import { BaseRepository } from "../../../utils/baseRepository";
import UserFavorite from "../../../models/user_products_favourite.model";

class UserProductFavouriteRepo extends BaseRepository<UserFavorite> {
  private static instance: UserProductFavouriteRepo | null = null;

  private constructor() {
    super(UserFavorite);
  }

  public static getInstance(): UserProductFavouriteRepo {
    if (!UserProductFavouriteRepo.instance) {
      UserProductFavouriteRepo.instance = new UserProductFavouriteRepo();
    }
    return UserProductFavouriteRepo.instance;
  }

  // You can add specific methods for UserFavorite repository if needed
}

export default UserProductFavouriteRepo;
