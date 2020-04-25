const axios = require('axios');
const USERNAME = process.env['USERNAME'];
const PASSWORD = process.env['PASSWORD'];
const INTERVAL = 60000 * 60 * 3;
const uuid = require('uuid').v1;

if ( !USERNAME || USERNAME.length <= 0 ) throw new Error("Must set environment variable USERNAME when running container");
if ( !PASSWORD || PASSWORD.length <= 0 ) throw new Error("Must set environment variable PASSWORD when running container");

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-SCHNUCKS-CLIENT-ID'] = uuid();
axios.defaults.baseURL = 'https://nourish.schnucks.com';

console.log('Starting Schnoupon Clipper')

async function getApiKey() {
  const response = await axios.post('https://appservices.schnucks.com/app/sso/api/user/authenticate', { logonId: USERNAME, password: PASSWORD })
  axios.defaults.headers.common['X-SSO-SCHNUCKS-TOKEN'] = response.headers['x-sso-schnucks-token']
  return response.headers['x-sso-schnucks-token'];
}

async function getAvailableCoupons() {
  const response = await axios.get('/app/coupons/api/coupons')
  return response.data.data
}

async function getClippedCoupons() {
  const response = await axios.get('/app/coupons/api/users/authenticated/clipped')
  return response.data.data;
}

async function filterClippedCoupons(coupons) {
  let clippedCoupons = {};
  (await getClippedCoupons()).forEach(coupon => {
    clippedCoupons[coupon.id] = true;
    if ( coupon.redeemedDate ) {
      console.log(`Congratulations!  You have redeemed ${coupon.description}`)
    }
  })

  return coupons.filter(coupon => !clippedCoupons[coupon.id])
}

async function clipAvailableCoupons(coupons) {
  console.log(`Clipping ${coupons.length} unclipped coupons`)
  for (let coupon of coupons) {
    console.log(`clipping coupon: ${coupon.brand} - ${coupon.shortDescription}`)
    await axios.post('/app/coupons/api/users/authenticated/clipped', {
      couponId: coupon.id
    })
      .then(res => console.log(res.data))
      .catch(err => console.log(err.toJSON()))
  }
  console.log(`Will check again at ${new Date(Date.now() + INTERVAL)}`)
}

console.log(`${new Date()} - Attempting to Clip!!`)
getApiKey()
  .then(getAvailableCoupons)
  .then(filterClippedCoupons)
  .then(clipAvailableCoupons)

setInterval(() => {
  console.log(`${new Date()} - Attempting to Clip!!`)
  getApiKey()
    .then(getAvailableCoupons)
    .then(clipAvailableCoupons)
}, INTERVAL)
