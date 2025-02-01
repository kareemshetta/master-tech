import { BaseRepository } from "../../../utils/baseRepository";
import User from "../../../models/users.model";

class UserRepository extends BaseRepository<User> {
  private static instance: UserRepository | null = null;

  private constructor() {
    super(User);
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  // You can add specific methods for User repository if needed
}

export default UserRepository;
