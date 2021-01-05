import { sequelize, Sequelize } from "./setup.js";
import { s3 } from "~/services/storage";
import { AppError, ErrorType } from "~/lib/errors";
import config from "~/config";
import { UserProfile } from "./User";

/*
 * ============================================
 * MEDIA
 * ============================================
 */
class Media extends Sequelize.Model {
  toJSON() {
    let model = Object.assign({}, this.get());
    delete model.id;
    delete model.userId;
    delete model.key;
    // delete model.url;
    // model.fileUrl = config.host + config.versionUrl + '/media/' + model.uuid + '/file';
    // model.downloadUrl = config.host + config.versionUrl + '/media/' + model.uuid + '/download';
    return model;
  }

  isOwner(user) {
    return this.userId === user.id;
  }

  async clear() {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      // Clear profile picture
      let profile = await UserProfile.findOne({
        where: {
          profilePicId: this.get("id"),
        },
        transaction,
      });

      if (profile !== null)
        await profile.update(
          {
            profilePicId: null,
          },
          { transaction }
        );

      // Clear posts picture
      await MediaInPost.destroy({
        where: {
          MediumId: this.get("id"),
        },
        transaction,
      });

      // Clear proposals picture
      await MediaInProposal.destroy({
        where: {
          MediumId: this.get("id"),
        },
        transaction,
      });

      await transaction.commit();
      return 1;
    } catch (e) {
      if (transaction) await transaction.rollback();
      console.error(e);
      if (e.error && e.error.generatedBy === "AppError") return e;
      return new AppError({
        name: e.name,
        message: e.message,
        statusCode: 401,
        type: ErrorType.DANGER,
      });
    }
  }
}

Media.init(
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
      unique: true,
      validate: {
        notNull: true,
      },
    },
    mimeType: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    imageWidth: {
      type: Sequelize.INTEGER,
      defaultValue: false,
    },
    imageHeight: {
      type: Sequelize.INTEGER,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Media",
  }
);

Media.addHook("beforeDestroy", "deleteObjectFromS3", async (media, options) => {
  await s3
    .deleteObject({
      Bucket: config.AWSBucket,
      Key: media.key,
    })
    .promise();
});

export { Media };
