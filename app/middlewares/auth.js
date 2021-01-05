import config from '~/config';
import { AppError, ErrorType } from '~/lib/errors';
import { User, UserType } from '~/models';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.query['token'] || req.session.token;
    if(!token) 
      throw new Error('Access Denied. No token provided. Please login again.');
    token = token.replace('Bearer ', '');
    let decoded = jwt.verify(token, config.privateKey);
    let user = await User.findOne({
      where: {
        email: decoded.data.email
      },
      include: [ 
        { association: 'userType' },
        { 
          association: 'profile',
          include: [
            {association: 'addresses'}
          ]
        },
      ],
    });
    if(user === null)
      throw new Error('User not found');
    req.auth = user;
    next();
  } catch(e) {
    console.error(`${e.fileName}: ${e.lineNumber}`, e);
    if(e.name === 'TokenExpiredError')
      e.message = 'Token expired. Please login again';
    return res.status(401).send(
      new AppError({
        name: 'AccessDeniedError',
        message: e.message,
        statusCode: 401,
        type: ErrorType.DANGER,
      })
    );
  }
}

export default authMiddleware;
