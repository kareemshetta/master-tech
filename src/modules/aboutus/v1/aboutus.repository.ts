import { BaseRepository } from "../../../utils/baseRepository";

import Aboutus from "../../../models/aboutus.model";

class AboutusRepository extends BaseRepository<Aboutus> {
  private static instance: AboutusRepository | null = null;

  private constructor() {
    super(Aboutus);
  }

  public static getInstance(): AboutusRepository {
    if (!AboutusRepository.instance) {
      AboutusRepository.instance = new AboutusRepository();
    }
    return AboutusRepository.instance;
  }

  // You can add specific methods for Aboutus repository if needed
}

export default AboutusRepository;
