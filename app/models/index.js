import { sequelize, Sequelize } from "./setup.js";
import { Currency } from "./Currency";
import { UserType } from "./UserType";
import { FacebookAuth, LocalAuth, GoogleAuth, User, UserProfile } from "./User";
import { Media } from "./Media";
import { Product, ProductCategory, ProductInMedia } from "./Product.js";
import { Bid } from "./Bid.js";
import { Order, PaymentMethod } from "./Order.js";
import { Cart, ProductInCart } from "./Cart.js";

/*
 * =====================
 * USER,USERPROFILE
 * =====================
 */
User.belongsTo(UserType, {
  as: "userType",
});

UserProfile.belongsTo(User, {
  as: "user",
});

User.hasOne(UserProfile, {
  as: "profile",
  foreignKey: "userId",
});

User.hasMany(Product, {
  as: "product",
  foreignKey: "userId",
});

UserProfile.belongsTo(Media, {
  as: "profilePic",
});

LocalAuth.belongsTo(User, {
  as: "user",
});

User.hasOne(LocalAuth, {
  as: "localAuth",
  foreignKey: "userId",
});

GoogleAuth.belongsTo(User, {
  as: "user",
});

User.hasOne(GoogleAuth, {
  as: "googleAuth",
  foreignKey: "userId",
});

FacebookAuth.belongsTo(User, {
  as: "user",
});

User.hasOne(FacebookAuth, {
  as: "facebookAuth",
  foreignKey: "userId",
});

/*
 * =====================
 * MEDIA
 * =====================
 */
Media.belongsTo(User, {
  as: "user",
});

/*
 * =====================
 * BID
 * =====================
 */
Bid.belongsTo(User, {
  as: "user",
});

Bid.belongsTo(Product, {
  as: "product",
});

Bid.belongsTo(Currency, {
  as: "currency",
});

/*
 * =====================
 * PRODUCT
 * =====================
 */

Product.belongsTo(Currency, {
  as: "currency",
});
Product.belongsTo(ProductCategory, {
  as: "productCategory",
});
Product.belongsToMany(Media, {
  as: "productPic",
  through: {
    model: ProductInMedia,
  },
});
Product.belongsToMany(Cart, {
  as: "cart",
  through: {
    model: ProductInCart,
  },
});

/*
 * =====================
 * ORDERS
 * =====================
 */
Order.belongsTo(PaymentMethod, {
  as: "paymentMethod",
});
Order.belongsTo(Currency, {
  as: "currency",
});
Order.belongsTo(User, {
  as: "user",
});
export {
  sequelize,
  Sequelize,
  Currency,
  UserType,
  User,
  LocalAuth,
  GoogleAuth,
  FacebookAuth,
  UserProfile,
  Media,
  Product,
  Cart,
  Bid,
  Order,
};
