import { BaseRepository } from "../../../utils/baseRepository";

import Store from "../../../models/stores.model";

class StoresRepository extends BaseRepository<Store> {
  private static instance: StoresRepository | null = null;

  private constructor() {
    super(Store);
  }

  public static getInstance(): StoresRepository {
    if (!StoresRepository.instance) {
      StoresRepository.instance = new StoresRepository();
    }
    return StoresRepository.instance;
  }

  // You can add specific methods for Store repository if needed
}

export default StoresRepository;
