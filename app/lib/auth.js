import config from '~/config';
import { AppError, ErrorType } from '~/lib/errors';
import jwt from 'jsonwebtoken';

let auth = {
  generateAuthToken: async (user) => {
    let u = {
      email: user.email,
    };

    const token = jwt.sign({
      data: u,
    }, config.privateKey, {
      expiresIn: config.sessionDuration 
    });
    return token;
  },

  generateRefreshToken: async (user) => {
    let u = {
      email: user.email,
    };

    const token = jwt.sign({
      data: u,
    }, config.privateKey, {
      expiresIn: config.refreshTokenLife
    });

    return token;
  },

  isSubscriptionValid: async (user) => {
    if(user.userType.slug === 'admin')
      return 1;

    if(user.subscription === null)
      return new AppError({
        statusCode: 403,
        name: 'Forbidden',
        message: 'You have not paid the subscription',
        type: ErrorType.DANGER, 
      });

    if(user.subscription.isBlocked())
      return new AppError({
        statusCode: 403,
        name: 'Forbidden',
        message: 'Your profile is blocked',
        type: ErrorType.DANGER, 
      });

    if(user.subscription.isCancelled())
      return new AppError({
        statusCode: 403,
        name: 'Forbidden',
        message: 'You have cancelled your subscription',
        type: ErrorType.DANGER, 
      });

    return 1;
  }
};

export default auth;
