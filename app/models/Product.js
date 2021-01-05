import { sequelize, Sequelize } from "./setup.js";

/*
 * ============================================
 * Product
 * ============================================
 */
class Product extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
  async findProductByUUID(productUUID) {}
  async findAllProducts() {}
  async createProduct() {}
  async updateProduct(productUUID) {}
  async deleteProduct() {}
}

Product.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV1,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    productType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    minimumBidValue: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Product",
  }
);
/*
 * ============================================
 * ProductCategory
 * ============================================
 */
class ProductCategory extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
  async findProductCAtegoryByUUID(productCategoryUUID) {}
  async findAllProductCategory() {}
  async createProductCategory() {}
  async updateProductCategoryByUUID(productCategoryUUID) {}
  async deleteProductCategory() {}
}

ProductCategory.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV1,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "ProductCategory",
  }
);
class ProductInMedia extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.userId;
    delete model.key;

    return model;
  }
}

ProductInMedia.init(
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "ProductInMedia",
  }
);
export { Product, ProductCategory, ProductInMedia };
