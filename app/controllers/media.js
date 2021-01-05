import config from "~/config";
import { sequelize, Media, ImageSize } from "~/models";
import { s3 } from "~/services/storage";
import Pagination from "~/lib/pagination";
import { AppError, errorResponse, ErrorType } from "~/lib/errors";
import { map, forEach } from "p-iteration";

const MediaController = {};

/**
 * @apiGroup 16_Media
 * @api {get} /media 1. Get All
 * @apiName Get all media
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get all the media stored. Admin can see
 * all of the media uploaded by any user. And other users can only see
 * the media they have uploaded. The request must include
 * the auth token in header.
 *
 * @apiHeader {String} Bearer-token User auth token
 *
 * @apiSuccess {Medium} media Array of Media instances
 * @apiSuccess {Pagination} pages Pagination instance
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *       "media": [
 *         {
 *           "uuid": "54a79b90-4542-11ea-941c-61c61ce8a2d0",
 *           "mimeType": "image/png",
 *           "name": "cfthLiYeag.png",
 *           "title": null,
 *           "description": null,
 *           "createdAt": "2020-02-01T22:29:37.000Z",
 *           "updatedAt": "2020-02-01T22:29:38.000Z",
 *           "user": {
 *             "uuid": "744c0b52-4512-11ea-8fee-4bfd936a11c1",
 *             "firstName": "Main",
 *             "lastName": "Customer"
 *           },
 *           "fileUrl": "http://localhost:9001/api/v1/media/54a79b90-4542-11ea-941c-61c61ce8a2d0/file",
 *           "downloadUrl": "http://localhost:9001/api/v1/media/54a79b90-4542-11ea-941c-61c61ce8a2d0/download"
 *         }
 *       ],
 *       "pages": {
 *         "page": 1,
 *         "total": 2,
 *         "totalPages": 1,
 *         "itemsPerPage": 10
 *       }
 *     }
 *
 */
MediaController.getAll = async (req, res) => {
  try {
    let request = {};
    if (req.auth.userType.slug !== "admin") {
      request = {
        userId: req.auth.id,
      };
    }
    let count = await Media.count({ where: { ...request } });
    let pagination = new Pagination(req.params.page, count);
    let media = await Media.findAll({
      ...pagination.request(),
      where: {
        ...request,
      },
      order: [["createdAt", "DESC"]],
      include: [{ association: "user" }],
    });
    pagination.setNextLink(
      `${config.host + config.versionUrl}/media/page/${pagination.page + 1}`
    );
    pagination.setPrevLink(
      `${config.host + config.versionUrl}/media/page/${pagination.page - 1}`
    );
    return res.status(200).json({
      media,
      ...pagination.toJSON(),
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 16_Media
 * @api {get} /media/:mediaUUID 2. Get Single
 * @apiName Get a media
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get all the media stored.
 *
 * @apiSuccess {Media} media Media instance
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *       "media": {
 *         "uuid": "d715c270-4527-11ea-99fc-b1dde3b11b42",
 *         "mimeType": "image/png",
 *         "name": "Screenshot_2020-01-28_17-21-54.png",
 *         "title": null,
 *         "description": null,
 *         "createdAt": "2020-02-01T19:20:00.000Z",
 *         "updatedAt": "2020-02-01T19:20:00.000Z",
 *         "user": {
 *           "uuid": "744c0b51-4512-11ea-8fee-4bfd936a11c1",
 *           "firstName": "Main",
 *           "lastName": "Seller"
 *         },
 *         "fileUrl": "http://localhost:9001/api/v1/media/d715c270-4527-11ea-99fc-b1dde3b11b42/file",
 *         "downloadUrl": "http://localhost:9001/api/v1/media/d715c270-4527-11ea-99fc-b1dde3b11b42/download"
 *       }
 *     }
 *
 * @apiError MediaNotFound Comment not found
 *
 */
MediaController.get = async (req, res) => {
  try {
    let media = await Media.findOne({
      where: {
        uuid: req.params.mediaUUID,
      },
      include: [{ association: "user" }],
    });
    if (media === null)
      throw new AppError({
        statusCode: 404,
        name: "MediaNotFound",
        message: "Media not found",
      });
    return res.status(200).json({
      media,
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

MediaController.getFileCommon = async (req, res) => {
  let media = await Media.findOne({
    where: {
      uuid: req.params.mediaUUID,
    },
    include: [{ association: "user" }],
  });
  if (media === null)
    throw new AppError({
      statusCode: 404,
      name: "MediaNotFound",
      message: "Media not found",
    });
  let file = await s3
    .getObject({
      Bucket: config.AWSBucket,
      Key: media.key,
    })
    .promise();
  return { media, file };
};

/**
 * @apiGroup 16_Media
 * @api {get} /media/:mediaUUID/file 3. Get File
 * @apiName Get media file
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get the file of media instance.
 *
 * @apiError MediaNotFound Comment not found
 */
MediaController.getFile = async (req, res) => {
  try {
    let { media, file } = await MediaController.getFileCommon(req, res);
    res.header("Content-Type", media.contentType);
    return res.status(200).send(file.Body);
  } catch (e) {
    console.error(e);
    if (e.name === "NoSuchKey")
      return errorResponse(
        res,
        new AppError({
          statusCode: 404,
          name: "MediaNotFound",
          message: "Media not found",
          type: ErrorType.DANGER,
        })
      );
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 16_Media
 * @api {get} /media/:mediaUUID/file 4. Download File
 * @apiName Download media file
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get download link of the media instance.
 *
 * @apiError MediaNotFound Comment not found
 */
MediaController.downloadFile = async (req, res) => {
  try {
    let { media, file } = await MediaController.getFileCommon(req, res);
    res.header("Content-Disposition", "attachment; filename=" + media.name);
    res.header("Content-Type", media.contentType);
    return res.status(200).send(file.Body);
  } catch (e) {
    console.error(e);
    if (e.name === "NoSuchKey")
      return errorResponse(
        res,
        new AppError({
          statusCode: 404,
          name: "MediaNotFound",
          message: "Media not found",
          type: ErrorType.DANGER,
        })
      );
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 16_Media
 * @api {post} /media 5. Create Media
 * @apiName Create media
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to create a media instance. The request should be multipart
 * form. The request must include file parameter. The request must include
 * the auth token in header.
 *
 * @apiHeader {String} Bearer-token User auth token
 * @apiHeader {String} Content-Type multipart/form-data; boundary=--------------------------904662899042743342762301
 *
 * @apiParam {File} media File object
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *     {
 *       "media": [
 *         {
 *           "uuid": "c0f3dac0-559b-11ea-9da8-53c56af490c2",
 *           "name": "1.jpg",
 *           "title": null,
 *           "description": null,
 *           "mimeType": "image/jpeg",
 *           "updatedAt": "2020-02-22T17:50:03.408Z",
 *           "createdAt": "2020-02-22T17:50:03.373Z",
 *           "fileUrl": "http://localhost:9001/api/v1/media/c0f3dac0-559b-11ea-9da8-53c56af490c2/file",
 *           "downloadUrl": "http://localhost:9001/api/v1/media/c0f3dac0-559b-11ea-9da8-53c56af490c2/download"
 *         },
 *         {
 *           "uuid": "c0f428e0-559b-11ea-9da8-53c56af490c2",
 *           "name": "cfthLiYeag.png",
 *           "title": null,
 *           "description": null,
 *           "mimeType": "image/png",
 *           "updatedAt": "2020-02-22T17:50:03.414Z",
 *           "createdAt": "2020-02-22T17:50:03.374Z",
 *           "fileUrl": "http://localhost:9001/api/v1/media/c0f428e0-559b-11ea-9da8-53c56af490c2/file",
 *           "downloadUrl": "http://localhost:9001/api/v1/media/c0f428e0-559b-11ea-9da8-53c56af490c2/download"
 *         }
 *       ]
 *     }
 *
 */
MediaController.create = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let media = req.files;
    media = await map(media, async (file) => {
      let m = await Media.create(
        {
          key: file.key,
          url: file.location,
          name: file.originalname,
          mimeType: file.mimetype,
        },
        { transaction }
      );
      await m.setUser(req.auth, { transaction });
      await m.save({ transaction });
      return m;
    });
    await transaction.commit();
    return res.status(200).json({
      media,
    });
  } catch (e) {
    if (transaction) await transaction.rollback();
    await forEach(req.files, async (file) => {
      await s3
        .deleteObject({
          Bucket: config.AWSBucket,
          Key: file.key,
        })
        .promise();
    });
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 16_Media
 * @api {put} /media/:mediaUUID 6. Update Media
 * @apiName Update media
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to edit the properties of media instance.
 * The request must include the auth token in header.
 *
 * @apiHeader {String} Bearer-token User auth token
 *
 * @apiParam {String} name Name of the file
 * @apiParam {String} title Title of the file
 * @apiParam {String} description Description of the file
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *       "message": "Media updated successfuly"
 *    }
 *
 * @apiError MediaNotFound Comment not found
 * @apiError Forbidden You are not the owner of this media item.
 */
MediaController.update = async (req, res) => {
  try {
    let media = await Media.findOne({
      where: {
        uuid: req.params.mediaUUID,
      },
    });
    if (media === null)
      throw new AppError({
        statusCode: 403,
        name: "MediaNotFound",
        message: "Media not found",
      });
    if (media.isOwner(req.auth) === false)
      throw new AppError({
        statusCode: 403,
        name: "Forbidden",
        message: "You are not the owner of this media item.",
      });
    if (req.body.name !== undefined) media.name = req.body.name;
    if (req.body.title !== undefined) media.title = req.body.title;
    if (req.body.description !== undefined)
      media.description = req.body.description;
    await media.save();
    return res.status(200).json({
      message: "Media updated successfully",
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 16_Media
 * @api {delete} /media/:mediaUUID 7. Delete Media
 * @apiName Delete media
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to delete media instance.
 * The request must include the auth token in header.
 *
 * @apiHeader {String} Bearer-token User auth token
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *       "message": "Media deleted successfuly"
 *    }
 *
 * @apiError MediaNotFound Comment not found
 * @apiError Forbidden You are not the owner of this media item.
 */
MediaController.delete = async (req, res) => {
  try {
    let media = await Media.findOne({
      where: {
        uuid: req.params.mediaUUID,
      },
    });
    if (media === null)
      throw new AppError({
        statusCode: 403,
        name: "MediaNotFound",
        message: "Media not found",
      });
    if (media.isOwner(req.auth) === false)
      throw new AppError({
        statusCode: 403,
        name: "Forbidden",
        message: "You are not the owner of this media item.",
      });
    let clear = await media.clear();
    if (clear !== 1) throw clear;
    await media.destroy();
    return res.status(200).json({
      message: "Media deleted successfully",
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

/*
 * ========================================================================
 * IMAGE SIZE SECTION
 * ========================================================================
 */
MediaController.getAllImageSizes = async (req, res) => {
  try {
    let imageSizes = await ImageSize.findAll();
    return res.status(200).json({
      imageSizes,
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

export default MediaController;
