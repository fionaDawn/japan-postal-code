# Japan Postal code

JavaScript module for Japan Postal Code.

Forked from https://github.com/mzp/japan-postal-code

JSON files fetched from https://fulllifecare.jp/common/js/ajaxzip2

## How to install

```
npm install japan-postal-code-fetch
```

## How to use

```js
var postal_code = require("japan-postal-code-fetch");

postal_code.get("1000001", function (address) {
  console.log(address.prefecture); // => "東京都"
  console.log(address.city); // => "千代田区"
  console.log(address.area); // => "千代田"
  console.log(address.street); // => ""
});
```

## LICENSE

MIT License
