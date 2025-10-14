import BaseService from "./BaseService";
import { COLLECTIONS } from "../constants/collections";

class CategoryService extends BaseService {
  constructor() {
    super(COLLECTIONS.CATEGORIES);
  }

  /**
   * Get categories by type
   */
  async getByType(type) {
    return this.queryWhere("type", "==", type);
  }

  /**
   * Get system default categories
   */
  async getSystemDefaults() {
    return this.queryWhere("isSystemDefault", "==", true);
  }
}

export default new CategoryService();
