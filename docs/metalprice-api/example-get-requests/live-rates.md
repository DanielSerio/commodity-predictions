# Live Rates

## URL Example

```
https://api.metalpriceapi.com/v1/latest
?api_key=[API_KEY]
&base=USD
&currencies=EUR,XAU,XAG
```

### Parameters

- api_key [Required] Your API Key. More details.
- base [optional] Specify a base currency. Base Currency will default to USD if this parameter is not defined.
- currencies [optional] Specify a comma-separated list of currency codes to limit API responses to specified currencies. If this parameter is not defined, the API will return all forex currencies and precious metals.
- math [optional] Specify math operators to perform on the result. Use value to refer to the rates. Specify one or more of the mathematical operators add, subtract, multiply, and/or divide. Learn more.
