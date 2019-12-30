# schnouponclipper

## Sniff the X-SSO-SCHNUCKS-TOKEN
* `Chrome`: `View->Developer->Developer Tools` 
* Filter Network requests by `XHR`
* Navigate to or Refresh: https://nourish.schnucks.com/app/coupons/home
* Look for any request that contains above header [Examples:  config, phones, emails, clipped, coupons]
* This will be a string with a mixtures of numbers and letters (a-z).

## Run the Container

```
docker run --env SCHNOUPON_KEY=<X-SSO-SCHNUCKS-TOKEN> --name schnouponclipper -d -t akutta/schnouponclipper
```

