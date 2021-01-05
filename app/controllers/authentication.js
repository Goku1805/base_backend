import { sequelize } from "~/models";
import { AppError, ErrorType, errorResponse } from "~/lib/errors";
import auth from "~/lib/auth";
import {
  GoogleAuth,
  LocalAuth,
  FacebookAuth,
  User,
  UserType,
  UserProfile,
  Allergy,
} from "~/models";
import config from "~/config";
import bcrypt from "bcrypt";
import moment from "moment";
import MailService from "~/services/mail";
import pug from "pug";
import path from "path";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { accessSync } from "fs";

const AuthenticationController = {};

/**
 _@apiGroup 03_Authentication
 * @api {post} /login 1. Login
 * @apiName Login user with credentials
 * @apiVersion 1.0.0
 *
 * @apiDescription 
 * This route is used to authenticate the
 * and providing the instance of the user, token 
 * of the user and the datetime at which the token expires
 *
 * @apiParam {String} email User email id
 * @apiParam {String} password User account password
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {DateTime} expiresOn Time on which token expires
 * @apiSuccess {String} token Token for interacting with api as user
 * @apiSuccess {User} user User instance
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Login Successful",
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJlbWFpbCI6InNlbGxlckB0ZXN0LmNvbSIsImxhc3RMb2dpbiI6IjIwMTktMTItMjZUMTk6Mjc6NDguMDAwWiJ9LCJpYXQiOjE1NzczODg0NjgsImV4cCI6MTU3NzQ3NDg2OH0._y2npyA2IaIXHstdBOE_OAMCqJUNBXCGOexpQrAjLYk",
 *      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJlbWFpbCI6InNlbGxlckB0ZXN0LmNvbSIsImxhc3RMb2dpbiI6IjIwMTktMTItMjZUMTk6Mjc6NDguMDAwWiJ9LCJpYXQiOjE1NzczODg0NjgsImV4cCI6MTU3NzQ3NDg2OH0._y2npyA2IaIXHstdBOE_OAMCqJUNBXCGOexpQrAjLYk",
 *      "expiresOn": "2019-12-22T09:31:05+00:00",
 *      "user": {
 *        "uuid": "0a6e9e00-2249-11ea-a2a3-9d0c4a3dfbeb",
 *        "firstName": "John",
 *        "lastName": "Doe",
 *        "email": "john@example.com"
 *        "userType": {
 *          "title": "Seller",
 *          "slug": "seller",
 *          "description": "User that is awesome"
 *        }
 *      }
 *    }
 *
 * @apiError ValidationError Error while validating user.
 * @apiError NotFoundError Error when user is not found.
 * @apiError AppError Error in the app
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 400 Bad Request 
 *    {
 *      "error": {
 *        "name": "NotFoundError",
 *        "statusCode": 400,
 *        "type": "danger",
 *        "message": "No user with these credential found",
 *        "instance": {
 *          "error": {
 *            "name": "NotFoundError",
 *            "statusCode": 400,
 *            "type": "danger",
 *            "message": "No user with these credential found",
 *            "generatedBy": "AppError",
 *            "instance": null
 *          }
 *        }
 *      }
 *    }
 */
AuthenticationController.login = async (req, res) => {
  try {
    if (!req.body.email)
      throw new AppError({
        name: "ValidationError",
        message: "Email field is not set",
      });
    if (!req.body.password)
      throw new AppError({
        name: "ValidationError",
        message: "Password field is not set",
      });

    let user = await User.findOne({
      where: {
        email: req.body.email.trim(),
      },
      include: [
        { association: "userType" },
        { association: "profile" },
        { association: "localAuth" },
      ],
    });
    console.log("hello");

    if (user === null)
      throw new AppError({
        name: "NotFoundError",
        message: "No user with these credential found.",
      });

    let validPassword = await bcrypt.compare(
      req.body.password,
      user.localAuth.password
    );

    if (!validPassword)
      throw new AppError({
        name: "ValidationError",
        message: "Password do not match.",
      });

    user.lastLogin = moment().format();

    let token = await auth.generateAuthToken(user);
    let refreshToken = await auth.generateRefreshToken(user);

    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        maxAge: config.refreshTokenLife,
        httpOnly: true,
      })
      .json({
        token,
        refreshToken,
        message: "Login successful.",
        expiresOn: moment.unix(jwt.decode(token).exp).format(),
        refreshTokenExpiresIn: config.refreshTokenExpiresIn,
        user: user,
      });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 03_Authentication
 * @api {post} /register 2. Regsiter
 * @apiName Register user with credentials
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to register a user with the provided
 * credentials. After successful registeration a user instance
 * is returned from the API.
 *
 * @apiParam {String} firstName User first name
 * @apiParam {String} lastName User last name
 * @apiParam {String} email User email id
 * @apiParam {String} password User account password
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {User} user User instance
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "message": "User created successfully",
 *        "user": {
 *          "uuid": "eb733910-2816-11ea-b753-13dc1842c626",
 *          "firstName": "John",
 *          "lastName": "Doe"
 *        }
 *      }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError AppError Error in the app
 */
AuthenticationController.register = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    console.log(req.body);
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

    let hashPassword = await bcrypt.hash(
      req.body.password.trim(),
      config.hashSalt
    );

    let userType = await UserType.findOne({
      where: {
        slug: "customer",
      },
      transaction,
    });

    let user = await User.create(
      {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
      },
      {
        transaction,
      }
    );

    await user.setUserType(userType, { transaction });
    await user.save({ transaction });

    let localAuth = await LocalAuth.create(
      {
        password: hashPassword,
      },
      { transaction }
    );
    await localAuth.setUser(user, { transaction });

    let userProfile = await UserProfile.create({}, { transaction });
    await userProfile.setUser(user, { transaction });

    await transaction.commit();

    return res.status(200).json({
      message: "User created successfully.",
      user: user,
    });
  } catch (e) {
    if (transaction) await transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 03_Authentication
 * @api {post} /logout 3. Logout
 * @apiName Logout the user
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to logout the user, it resets the
 * token. The request header must include auth token.
 *
 * @apiHeader {String} Bearer-token User auth token
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "message": "Logout successful"
 *      }
 *
 */
AuthenticationController.logout = async (req, res) => {
  try {
    const refreshToken =
      req.headers["x-refresh-token"] || req.cookies.refresh_token;
    return res.status(200).clearCookie("refresh_token").json({
      message: "Logout successful",
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 03_Authentication
 * @api {post} /forgotPassword 4. Forgot Password
 * @apiName Forgot Password
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to reset password for the
 *
 * @apiParam {String} email User email id
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "message": "Password reset successfully"
 *      }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError UserNotFound User not found with the given email
 * @apiError AppError Error in the app
 */
AuthenticationController.forgotPassword = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    if (req.body.email === undefined || req.body.email.length < 1)
      throw new AppError({
        name: "ValidationError",
        message: "Email not defined",
        statusCode: 401,
        type: ErrorType.DANGER,
      });
    if (req.body.password.length < 8)
      throw new AppError({
        name: "ValidationError",
        message: "Password should be at least 8 character long.",
      });

    let user = await User.findOne(
      {
        where: {
          email: req.body.email,
        },
        include: [{ association: "localAuth" }],
      },
      { transaction }
    );

    if (user === null)
      throw new AppError({
        name: "UserNotFound",
        message: "User not found with the given email",
        statusCode: 404,
        type: ErrorType.DANGER,
      });

    let newPassword = randomstring.generate();
    let hashPassword = await bcrypt.hash(newPassword, config.hashSalt);
    await user.localAuth.update(
      {
        password: hashPassword,
      },
      { transaction }
    );

    const title = "Password reset request!";
    const message =
      "Password has been reset. Log into your account and change password.";

    const params = {
      Source: config.mailAddress,
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: title,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: pug.renderFile(
              path.resolve(
                path.join(config.rootFolder, "/views/emails/changePassword.pug")
              ),
              { title, message, newPassword }
            ),
          },
          Text: {
            Charset: "UTF-8",
            Data: message,
          },
        },
      },
    };

    const sendEmail = await MailService.sendEmail(params).promise();
    await user.save({ transaction });
    await transaction.commit();
    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (e) {
    if (transaction) await transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};

/**
 * @apiGroup 03_Authentication
 * @api {post} /token 5. Refresh Token
 * @apiName Refresh Token
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * This route is used to get the refreshed access token using
 * using the previous token and refresh token.
 *
 * @apiParam {String} token Previous token
 * @apiParam {String} refresh_token Refresh token
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJlbWFpbCI6InNlbGxlckB0ZXN0LmNvbSIsImxhc3RMb2dpbiI6IjIwMTktMTItMjZUMTk6Mjc6NDguMDAwWiJ9LCJpYXQiOjE1NzczODg0NjgsImV4cCI6MTU3NzQ3NDg2OH0._y2npyA2IaIXHstdBOE_OAMCqJUNBXCGOexpQrAjLYk",
 *        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJlbWFpbCI6InNlbGxlckB0ZXN0LmNvbSIsImxhc3RMb2dpbiI6IjIwMTktMTItMjZUMTk6Mjc6NDguMDAwWiJ9LCJpYXQiOjE1NzczODg0NjgsImV4cCI6MTU3NzQ3NDg2OH0._y2npyA2IaIXHstdBOE_OAMCqJUNBXCGOexpQrAjLYk",
 *        "expiresOn": "2019-12-22T09:31:05+00:00",
 *        "user": {
 *          "uuid": "eb733910-2816-11ea-b753-13dc1842c626",
 *          "firstName": "John",
 *          "lastName": "Doe"
 *        }
 *      }
 *
 *
 *
 * @apiError ValidationError Error while validating creditials.
 * @apiError UserNotFound User not found with the given email
 * @apiError AppError Error in the app
 */
AuthenticationController.refreshToken = async (req, res) => {
  try {
    const refreshToken =
      req.headers["x-refresh-token"] || req.cookies.refresh_token;
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    token = token.replace("Bearer ", "");
    if (!token)
      throw new Error("Access Denied. No token provided. Please login again.");
    if (!refreshToken)
      throw new Error(
        "Access Denied. No refresh token provided. Please login again."
      );
    const decodedToken = await jwt.decode(token);
    if (!decodedToken)
      throw new Error("Error reading access token. Please login again.");
    let decodedRefreshToken = jwt.verify(refreshToken, config.privateKey);
    if (decodedRefreshToken.data.email !== decodedToken.data.email)
      throw new Error("Tokens do not match");
    const user = await User.findOne({
      where: {
        email: decodedToken.data.email,
      },
      include: [{ association: "userType" }, { association: "profile" }],
    });
    token = await auth.generateAuthToken(user);
    return res.status(200).json({
      refreshToken,
      token,
      user,
      expiresOn: moment.unix(jwt.decode(token).exp).format(),
    });
  } catch (e) {
    console.error(e);
    return errorResponse(res, e);
  }
};

AuthenticationController.loginGoogle = async (req, res) => {
  let transaction;
  try {
    const { idToken, accessToken } = req.body;
    // let url = OAuth2Client.GOOGLE_TOKEN_INFO_URL;
    // url = url.replace("tokeninfo", "");
    // url += "userinfo";
    // const googleUserInfo = await axios.get(url, {
    //   headers: {
    //     authorization: "Bearer " + accessToken,
    //   },
    // });
    const tokenInfo = await OAuth2Client.getTokenInfo(accessToken);
    console.log(tokenInfo);
    return res.status(200).json({
      tokenInfo,
    });

    const userid = payload["sub"];
    const googleAuth = await GoogleAuth.findOne({
      where: {
        googleId: userid,
      },
      include: [
        {
          association: "user",
          include: [
            { association: "userType" },
            { association: "profile" },
            { association: "localAuth" },
          ],
        },
      ],
    });
    if (googleAuth === null) {
      transaction = await sequelize.transaction();
      let userType = await UserType.findOne({
        where: {
          slug: "customer",
        },
        transaction,
      });

      let user = await User.create(
        {
          firstName: payload["given_name"],
          lastName: payload["family_name"],
          email: payload["email"],
        },
        {
          transaction,
        }
      );

      await user.setUserType(userType, { transaction });
      await user.save({ transaction });

      let googleAuth = await GoogleAuth.create(
        {
          googleId: payload["sub"],
        },
        { transaction }
      );
      await googleAuth.setUser(user, { transaction });

      let userProfile = await UserProfile.create({}, { transaction });
      await userProfile.setUser(user, { transaction });

      await transaction.commit();
    }

    let user = googleAuth.user;

    let token = await auth.generateAuthToken(user);
    let refreshToken = await auth.generateRefreshToken(user);

    return res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        maxAge: config.refreshTokenLife,
        httpOnly: true,
      })
      .json({
        token,
        refreshToken,
        message: "Login successful.",
        expiresOn: moment.unix(jwt.decode(token).exp).format(),
        refreshTokenExpiresIn: config.refreshTokenExpiresIn,
        user: googleAuth.user,
      });
  } catch (e) {
    if (transaction) await transaction.rollback();
    console.error(e);
    return errorResponse(res, e);
  }
};

export default AuthenticationController;
