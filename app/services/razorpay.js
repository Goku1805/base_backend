import Razorpay from 'razorpay';
import CONFIG from '~/config';

var instance = new Razorpay({
  key_id: CONFIG.razorpayKeyId,
  key_secret: CONFIG.razorpayKeySecret,
});

export default instance;