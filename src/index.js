const axios = require('axios');
const SCHNOUPON_KEY = process.env['SCHNOUPON_KEY'];
const INTERVAL = 60000 * 60 * 24;

if ( !SCHNOUPON_KEY || SCHNOUPON_KEY.length <= 0 ) throw new Error("Must set environment variable SCHNOUPON_KEY when running container");

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-SCHNUCKS-CLIENT-ID'] = '3e0bd456-0155-4d3e-ab18-d6767fcd4ff7';
axios.defaults.headers.common['X-SSO-SCHNUCKS-TOKEN'] = SCHNOUPON_KEY;
axios.defaults.baseURL = 'https://nourish.schnucks.com';

console.log('Starting Schnoupon Clipper')

async function getAvailableCoupons() {
  const response = await axios.get('/app/coupons/api/coupons')
  return response.data.data
}

async function clipAvailableCoupons(coupons) {
  for (let coupon of coupons) {
    console.log(`clipping coupon: ${coupon.brand} - ${coupon.shortDescription}`)
    await axios.post('/app/coupons/api/users/authenticated/clipped', {
      couponId: coupon.id
    })
      .then(res => console.log(res.data))
      .catch(err => console.log(err.toJSON()))
  }
}

getAvailableCoupons().then(clipAvailableCoupons)
setInterval(() => {
  getAvailableCoupons()
    .then(clipAvailableCoupons)
}, INTERVAL)
