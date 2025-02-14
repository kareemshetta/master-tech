import { BaseRepository } from "../../../utils/baseRepository";
import Contact from "../../../models/contact.model";

class ContactusRepository extends BaseRepository<Contact> {
  private static instance: ContactusRepository | null = null;

  private constructor() {
    super(Contact);
  }

  public static getInstance(): ContactusRepository {
    if (!ContactusRepository.instance) {
      ContactusRepository.instance = new ContactusRepository();
    }
    return ContactusRepository.instance;
  }

  // You can add specific methods for Contact repository if needed
}

export default ContactusRepository;
