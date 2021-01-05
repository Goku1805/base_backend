import { sequelize, Sequelize } from "./setup.js";
import { UserType } from "./UserType";
import bcrypt from "bcrypt";
import config from "~/config";

/*
 * ============================================
 * USER
 * ============================================
 */
class User extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.password;
    delete model.createdAt;
    delete model.updatedAt;
    delete model.userTypeId;
    delete model.token;
    delete model.email;
    delete model.lastLogin;
    delete model.blocked;
    return model;
  }

  unblocked() {
    let model = Object.assign({}, this.get());
    return model;
  }

  fullName() {
    return this.firstName + " " + this.lastName;
  }
}

User.init(
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
      validate: {
        notNull: true,
      },
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Please enter First Name field." },
        len: { args: [2, 50], msg: "First Name should be of 2-50 characters" },
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists",
      },
      validate: {
        notNull: { msg: "Please enter Email field." },
        notEmpty: { args: true, msg: "Email field cannot be empty" },
        isEmail: { args: true, msg: "Email should be valid email" },
      },
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: bcrypt.hashSync("password", config.hashSalt),
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Please enter Password field." },
      },
    },
    lastLogin: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "User",
  }
);

/*
 * ============================================
 * USER PROFILE
 * ============================================
 */
class UserProfile extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.userId;
    delete model.profilePicId;
    delete model.coverPicId;
    return model;
  }
}

UserProfile.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: Sequelize.STRING,
    },
    dob: {
      type: Sequelize.DATE,
    },
  },
  {
    sequelize: sequelize,
    modelName: "UserProfile",
  }
);

/*
 * ============================================
 * LOCAL AUTH
 * ============================================
 */
class LocalAuth extends Sequelize.Model {
  toJSON() {
    // let model = Object.assign({}, this.get());
    // delete model.id;
    // delete model.userId;
    // delete model.password;
    // delete model.createdAt;
    // delete model.updatedAt;
    // return model;
    return undefined;
  }
}

LocalAuth.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: bcrypt.hashSync("password", config.hashSalt),
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Please enter Password field." },
      },
    },
  },
  {
    sequelize: sequelize,
    modelName: "LocalAuth",
  }
);

/*
 * ============================================
 * FACEBOOK AUTH
 * ============================================
 */
class GoogleAuth extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.googleId;
    delete model.userId;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

GoogleAuth.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    googleId: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  {
    sequelize: sequelize,
    modelName: "GoogleAuth",
  }
);

/*
 * ============================================
 * FACEBOOK AUTH
 * ============================================
 */
class FacebookAuth extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.userId;
    delete model.createdAt;
    delete model.updatedAt;
    return model;
  }
}

FacebookAuth.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize: sequelize,
    modelName: "FacebookAuth",
  }
);

export { User, UserProfile, LocalAuth, GoogleAuth, FacebookAuth };
