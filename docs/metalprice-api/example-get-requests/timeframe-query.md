# Timeframe Query

## URL Example

```
https://api.metalpriceapi.com/v1/timeframe
?api_key=[API_KEY]
&start_date=2021-04-22
&end_date=2021-04-23
&base=USD
&currencies=EUR,XAU,XAG
```

### Parameters

- api_key [Required] Your API Key. More details.
- start_date [Required] Specify the start date of your timeframe.
- end_date [Required] Specify the end date of your timeframe.
- base [optional] Specify a base currency. Base Currency will default to USD if this parameter is not defined.
- currencies [optional] Specify a comma-separated list of currency codes to limit API responses to specified currencies. If this parameter is not defined, the API will return all supported currencies.
