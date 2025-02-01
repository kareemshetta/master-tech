import { BaseRepository } from "../../../utils/baseRepository";
import Admin from "../../../models/admins.model";

class AdminRepository extends BaseRepository<Admin> {
  private static instance: AdminRepository | null = null;

  private constructor() {
    super(Admin);
  }

  public static getInstance(): AdminRepository {
    if (!AdminRepository.instance) {
      AdminRepository.instance = new AdminRepository();
    }
    return AdminRepository.instance;
  }

  // You can add specific methods for Admin repository if needed
}

export default AdminRepository;
