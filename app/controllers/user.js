import {
  User,
  UserProfile,
  UserType,
  Allergy,
  Location,
  sequelize,
} from "~/models";
import { errorResponse, AppError, ErrorType } from "~/lib/errors";
import bcrypt from "bcrypt";
import config from "~/config";

const UserController = {};

/**
 * @apiGroup 13 _User
 * @api {get} /profile 1. Get Profile
 * @apiName Get Profile
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get the profile of the logged in user
 * using refresh token.
 *
 * @apiParam {String} token Previous token
 * @apiParam {String} refresh_token Refresh token
 *
 * @apiSuccess {User} user User Instance with UserType and UserProfile
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "user": {
 *          "uuid": "eb733910-2816-11ea-b753-13dc1842c626",
 *          "firstName": "John",
 *          "lastName": "Doe",
 *          "email": "john@doe.com",
 *          "profile": {
 *            "phone": "9876543210"
 *          }
 *        }
 *      }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError UserNotFound User not found with the given email
 * @apiError AppError Error in the app
 */
UserController.getProfile = async (req, res) => {
  try {
    let user = req.auth;
    let userProfile = await user.getProfile({
      include: [
        {
          association: "addresses",
          where: {
            disabled: false,
          },
          include: [
            {
              association: "location",
              include: [{ association: "shippingZone" }],
            },
          ],
        },
      ],
    });
    let userModel = {};
    userModel.userType = user.userType;
    userModel.firstName = user.firstName;
    userModel.lastName = user.lastName;
    userModel.email = user.email;
    userModel.profile = userProfile;
    return res.status(200).json({
      user: userModel,
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 13 _User
 * @api {get} /allDeliveryBoys 2. Get Delivery Boys
 * @apiName Get Profile of all Delivery Boys
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get the profile of all the Delivery boys
 * using refresh token.
 *
 *
 * @apiSuccess {User} user User Instance with Address,Location and  UserProfile
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "deliveryBoys": [
        {
            "uuid": "328b65e3-241d-11eb-bf61-87ff42f0d0d1",
            "firstName": "First",
            "lastName": "Deliveryboy",
            "profile": {
                "phone": "123456789",
                "dob": "1994-07-09T00:00:00.000Z",
                "createdAt": "2020-11-11T12:55:39.000Z",
                "updatedAt": "2020-11-11T12:55:39.000Z",
                "addresses": []
            },
            "locations": [
                {
                    "uuid": "346dba71-241d-11eb-bf61-87ff42f0d0d1",
                    "title": "Bhandarkar Road",
                    "latitude": "18.5181",
                    "longitude": "73.8362",
                    "disabled": false
                },
                {
                    "uuid": "346dba72-241d-11eb-bf61-87ff42f0d0d1",
                    "title": "Bhavani Peth",
                    "latitude": "18.5117",
                    "longitude": "73.8699",
                    "disabled": false
                }
            ]
        },
        {
            "uuid": "328b65e4-241d-11eb-bf61-87ff42f0d0d1",
            "firstName": "Second",
            "lastName": "Deliveryboy",
            "profile": null,
            "locations": [
                {
                    "uuid": "346dba74-241d-11eb-bf61-87ff42f0d0d1",
                    "title": "Bibvewadi",
                    "latitude": "18.4690",
                    "longitude": "73.8641",
                    "disabled": false
                },
                {
                    "uuid": "346dba70-241d-11eb-bf61-87ff42f0d0d1",
                    "title": "Balaji Nagar",
                    "latitude": "18.4646",
                    "longitude": "73.8603",
                    "disabled": false
                }
            ]
        },
        {
            "uuid": "3ff0a410-24c3-11eb-907f-253309b8a3df",
            "firstName": "Gokul",
            "lastName": "Rajan",
            "profile": {
                "phone": "9898989898",
                "dob": "1994-07-09T00:00:00.000Z",
                "createdAt": "2020-11-12T08:44:17.000Z",
                "updatedAt": "2020-11-12T08:44:17.000Z",
                "addresses": []
            },
            "locations": [
                {
                    "uuid": "346dba72-241d-11eb-bf61-87ff42f0d0d1",
                    "title": "Bhavani Peth",
                    "latitude": "18.5117",
                    "longitude": "73.8699",
                    "disabled": false
                },
                {
                    "uuid": "346dba73-241d-11eb-bf61-87ff42f0d0d1",
                    "title": "Bhawani Peth Road",
                    "latitude": "18.5117",
                    "longitude": "73.8699",
                    "disabled": false
                }
            ]
        }
    ]
 *      }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError UserNotFound User not found with the given email
 * @apiError AppError Error in the app
 */
UserController.getAllDeliveryBoys = async (req, res) => {
  try {
    let deliveryBoys = await User.findAll({
      where: {
        userTypeId: 3,
      },
      include: [
        {
          association: "userType",
          where: {
            slug: UserType.types.DELIVERYBOY,
          },
        },
        {
          association: "profile",
          include: [{ association: "profilePic" }],
        },
        { association: "zones" },
        { association: "locations" },
      ],
    });
    return res.status(200).json({
      deliveryBoys,
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

UserController.getDeliveryBoy = async (req, res) => {
  try {
    let { userUUID } = req.params;
    let deliveryBoy = await User.findOne({
      where: {
        userTypeId: 3,
        uuid: userUUID,
      },
      include: [
        {
          association: "userType",
          where: {
            slug: UserType.types.DELIVERYBOY,
          },
        },
        {
          association: "profile",
          include: [
            { association: "profilePic" },
            { association: "addresses" },
          ],
        },
        { association: "zones" },
        { association: "locations" },
        { association: "localAuth" },
      ],
    });
    if (deliveryBoy === null)
      throw new AppError({
        name: "DeliveryBoyNotFound",
        message: "DeliveryBoy not found",
        statusCode: 404,
      });
    var d = deliveryBoy.toJSON();
    d.email = deliveryBoy.email;
    return res.status(200).json({
      deliveryBoy: d,
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

UserController.updateDeliveryBoy = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let { userUUID } = req.params;
    let {
      firstName,
      lastName,
      email,
      dob,
      phone,
      addressStreet,
      addressLandmar,
      addressCity,
      addressState,
      addressCountry,
    } = req.body;
    let deliveryBoy = await User.findOne({
      where: {
        userTypeId: 3,
        uuid: userUUID,
      },
      include: [
        {
          association: "userType",
          where: {
            slug: UserType.types.DELIVERYBOY,
          },
        },
        {
          association: "profile",
          include: [
            { association: "profilePic" },
            { association: "addresses" },
          ],
        },
        { association: "zones" },
        { association: "locations" },
        { association: "localAuth" },
      ],
      transaction,
    });
    if (deliveryBoy === null)
      throw new AppError({
        name: "DeliveryBoyNotFound",
        message: "DeliveryBoy not found",
        statusCode: 404,
      });
    await deliveryBoy.update(
      {
        firstName,
        lastName,
        email,
      },
      { transaction }
    );
    await deliveryBoy.profile.update({
      dob,
      phone,
    });
    let address = deliveryBoy.profile.addressses.find((e) => e.defaultAddress);
    await address.update(
      {
        addressStreet,
        addressLandmark,
        addressCity,
        addressState,
        addressCountry,
      },
      { transaction }
    );
    await transaction.commit();
    return res.status(200).json({
      message: "Deliveryboy updated successfully",
    });
  } catch (e) {
    if (transaction) await transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 13 _User
 * @api {put} /profile 3. Update existing User Profile
 * @apiName Update existing user with credentials
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to update existing user only provided with
 * credentials. After successful registeration a shippingZone instance
 * is returned from the API.
 *
 * @apiParam {String} first name User First Name
 * @apiParam {String} last name User Last Name
 * @apiParam {String} phone User Phone
 * @apiParam {Date} dob User DOB
 *
 *
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {ShippingZone} ShippingZone instance
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *     {
 *
 *   "message": "ShippingZone added Successfully",
 *   "shippingZone": {
 *       "firstName": "zone-3",
 *       "lastName": "Zone-3",
 *       "phone": "9898989898",
 *       "dob" 1994-07-09 00:00:00:
 *       "updatedAt": "2020-10-12T09:34:11.892Z",
 *       "createdAt": "2020-10-12T09:34:11.892Z"
 *   }
 *   }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError AppError Error in the app
 */

UserController.updateProfile = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    if (req.auth.userType.slug !== "customer") {
      throw new AppError({
        name: "Forbidden",
        message: "You are not allowed to use this route.",
      });
    }
    let { firstName, lastName, phone, dob } = req.body;

    await req.auth.update(
      {
        firstName,
        lastName,
      },
      {
        transaction,
      }
    );

    await req.auth.profile.update(
      {
        phone,
        dob,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (e) {
    if (transaction) await transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 13 _User
 * @api {post} /addUser 4. Create User
 * @apiName Register user with different types with credentials
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to register multiple types of user with the provided
 * credentials. After successful registeration a user instance
 * is returned from the API.
 *
 * @apiParam {String} firstName User first name
 * @apiParam {String} lastName User last name
 * @apiParam {String} email User email id
 * @apiParam {String} password User account password
 * @apiParam {String} dob User date of birth
 * @apiParam {String} phone User phone
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {User} user User instance
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *     {
 *  "message": "Delivery boy created successfully.",
 *   "user": {
 *       "uuid": "cd1da930-086e-11eb-9a76-15334033c1b8",
 *       "firstName": "siddhart",
 *       "lastName": "sharma"
 *    }
 *   }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError AppError Error in the app
 */

UserController.createUser = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    if (req.auth.userType.slug !== "admin") {
      throw new AppError({
        name: "Forbidden",
        message: "You are not allowed to use this route.",
      });
    }
    if (!req.body.password || req.body.password.length <= 0)
      throw new AppError({
        name: "ValidationError",
        message: "Password not provided!",
      });
    if (req.body.password.length < 8)
      throw new AppError({
        name: "ValidationError",
        message: "Password should be at least 8 character long.",
      });
    let reqUserType = req.body.userTypeFrom;
    let userType = await UserType.findOne({
      where: {
        slug: reqUserType,
      },
      transaction,
    });
    let hashPassword = await bcrypt.hash(req.body.password, config.hashSalt);

    let user;
    if (reqUserType === "admin") {
      user = await User.create(
        {
          firstName: req.body.firstName.trim(),
          lastName: req.body.lastName.trim(),
          email: req.body.email.trim(),
          password: hashPassword,
        },
        { transaction }
      );
      console.log(user);
      await user.setUserType(userType, { transaction });
      await user.save({ transaction });
      let userProfile = await UserProfile.create(
        {
          dob: req.body.dob,
          phone: req.body.phone.trim(),
        },
        { transaction }
      );
      await userProfile.setUser(user, { transaction });
      await transaction.commit();

      return res.status(200).json({
        message: "User created successfully.",
        user: user,
      });
    }
    if (reqUserType === "customer") {
      user = await User.create(
        {
          firstName: req.body.firstName.trim(),
          lastName: req.body.lastName.trim(),
          email: req.body.email.trim(),
          password: hashPassword,
        },
        { transaction }
      );

      await user.setUserType(userType, { transaction });
      await user.save({ transaction });
      let userProfile = await UserProfile.create(
        {
          dob: req.body.dob,
          phone: req.body.phone.trim(),
        },
        { transaction }
      );
      await userProfile.setUser(user, { transaction });
      await transaction.commit();

      return res.status(200).json({
        message: "Customer created successfully.",
        user: user,
      });
    }
    if (reqUserType === "deliveryboy") {
      user = await User.create(
        {
          firstName: req.body.firstName.trim(),
          lastName: req.body.lastName.trim(),
          email: req.body.email.trim(),
          password: hashPassword,
        },
        { transaction }
      );

      await user.setUserType(userType, { transaction });
      await user.save({ transaction });
      let userProfile = await UserProfile.create(
        {
          dob: req.body.dob,
          phone: req.body.phone.trim(),
        },
        { transaction }
      );
      let { location } = req.body;
      let addLocation = await Location.findAll({
        where: {
          uuid: [location],
        },
      });
      if (location === null)
        throw new AppError({
          name: "Not Found",
          message: "location not found.",
        });
      await user.setLocation({ addLocation }, { transaction });
      await userProfile.setUser(user, { transaction });
      await transaction.commit();

      return res.status(200).json({
        message: "Delivery boy created successfully.",
        user: user,
      });
    }
  } catch (e) {
    if (transaction) transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};
/**
 * @apiGroup 13 _User
 * @api {post} /addDeliveryBoy 5. Create Delivery Boy
 * @apiName Create Delivery Boy  with credentials
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to create delivery boy with the provided
 * credentials. After successful registeration a user instance
 * is returned from the API.
 *
 * @apiParam {String} firstName User first name
 * @apiParam {String} lastName User last name
 * @apiParam {String} email User email id
 * @apiParam {String} password User account password
 * @apiParam {String} dob User date of birth
 * @apiParam {String} phone User phone
 * @apiParam {String} location
 *
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {User} user User instance
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *     {
 *   "message": "Delivery boy created successfully.",
 *   "deliveryBoy": {
 *       "uuid": "3ff0a410-24c3-11eb-907f-253309b8a3df",
 *       "firstName": "Gokul",
 *       "lastName": "Rajan"
 *   }
 *   }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError AppError Error in the app
 */
UserController.createDeliveryBoy = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (req.auth.userType.slug !== "admin") {
      throw new AppError({
        name: "Forbidden",
        message: "You are not allowed to use this route.",
      });
    }
    if (!req.body.password || req.body.password.length <= 0)
      throw new AppError({
        name: "ValidationError",
        message: "Password not provided!",
      });
    if (req.body.password.length < 8)
      throw new AppError({
        name: "ValidationError",
        message: "Password should be at least 8 character long.",
      });
    let userType = await UserType.findOne({
      where: {
        slug: "deliveryboy",
      },
      transaction,
    });
    let hashPassword = await bcrypt.hash(req.body.password, config.hashSalt);
    let deliveryBoy = await User.create(
      {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        password: hashPassword,
      },
      { transaction }
    );
    let { location } = req.body;
    let addLocation = await Location.findAll({
      where: {
        uuid: [location],
      },
    });
    console.log(addLocation);
    if (addLocation === null)
      throw new AppError({
        name: "Not Found",
        message: "location not found.",
      });
    await deliveryBoy.setLocations(addLocation, { transaction });
    await deliveryBoy.setUserType(userType, { transaction });
    await deliveryBoy.save({ transaction });
    let userProfile = await UserProfile.create(
      {
        dob: req.body.dob,
        phone: req.body.phone.trim(),
      },
      { transaction }
    );
    await userProfile.setUser(deliveryBoy, { transaction });
    await transaction.commit();

    return res.status(200).json({
      message: "Delivery boy created successfully.",
      deliveryBoy,
    });
  } catch (e) {
    if (transaction) transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};
/**
 * @apiGroup 13 _User
 * @api {put} /editUser 6. Edit User
 * @apiName Edit user with different types with credentials
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to edit multiple types of user with the provided
 * credentials. After successful registeration a user instance
 * is returned from the API.
 *
 * @apiParam {String} firstName User first name
 * @apiParam {String} lastName User last name
 * @apiParam {String} dob User date of birth
 * @apiParam {String} phone User phone
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {User} user User instance
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *     {
 *        {
 *         "message": "Profile updated successfully"
 *        }
 *     }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError AppError Error in the app
 */
UserController.editUser = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let user = await User.findOne({
      where: {
        uuid: req.params.userUUID,
      },
      include: [
        {
          association: "userType",
        },
        {
          association: "profile",
        },
      ],
    });
    if (user.userType.slug === "admin") {
      let { firstName, lastName, phone, dob } = req.body;
      await user.update({ firstName, lastName }, { transaction });
      await user.profile.update({ phone, dob }, { transaction });
    }
    if (user.userType.slug === "deliveryboy") {
      let { firstName, lastName, phone, dob } = req.body;
      await user.update({ firstName, lastName }, { transaction });
      await user.profile.update({ phone, dob }, { transaction });
    }
    if (user.userType.slug === "customer") {
      let allergy = await Allergy.findAll({
        where: {
          uuid: [req.body.allergies],
        },
      });
      if (allergy.length === 0) {
        throw new AppError({
          name: "Not Found",
          message: "Allergy not found",
        });
      }
      await user.profile.setAllergy(allergy, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (e) {
    if (transaction) transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};

UserController.blockUser = async (req, res) => {};
export default UserController;
