/* ================================================================ *
    ajaxzip3.js ---- AjaxZip3 郵便番号→住所変換ライブラリ

    Copyright (c) 2015 MIZUNO Hiroki
    http://github.com/mzp/japan-postal-code

    Copyright (c) 2008-2015 Ninkigumi Co.,Ltd.
    http://ajaxzip3.github.io/

    Copyright (c) 2006-2007 Kawasaki Yusuke <u-suke [at] kawa.net>
    http://www.kawa.net/works/ajax/AjaxZip2/AjaxZip2.html

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
* ================================================================ */

const fetch = require("node-fetch");

JSONDATA = "https://fulllifecare.jp/common/js/ajaxzip2/data/zip-";
CACHE = [];

PREFMAP = [
  null,
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

exports.get = function (zip_code, callback) {
  // 郵便番号を数字のみ7桁取り出す
  //    var zipoptimize = function(AjaxZip3.fzip1, AjaxZip3.fzip2){
  var vzip = zip_code;
  if (!vzip) return;

  // extract number only
  var nzip = "";
  for (var i = 0; i < vzip.length; i++) {
    var chr = vzip.charCodeAt(i);
    if (chr < 48) continue;
    if (chr > 57) continue;
    nzip += vzip.charAt(i);
  }
  if (nzip.length < 7) return;

  // fetch from cache data using upper 3 digit
  var zip3 = nzip.substr(0, 3);
  var data = CACHE[zip3];
  if (data) return parse(nzip, data, callback);

  // fetch by fetch
  fetchRemote(nzip, callback);
};

var parse = function (nzip, data, callback) {
  var array = data[nzip];
  // Opera バグ対策：0x00800000 を超える添字は +0xff000000 されてしまう
  var opera = nzip - 0 + 0xff000000 + "";
  if (!array && data[opera]) array = data[opera];
  if (!array) return;
  var pref_id = array[0]; // 都道府県ID
  if (!pref_id) return;
  var jpref = PREFMAP[pref_id]; // 都道府県名
  if (!jpref) return;
  var jcity = array[1];
  if (!jcity) jcity = ""; // 市区町村名
  var jarea = array[2];
  if (!jarea) jarea = ""; // 町域名
  var jstrt = array[3];
  if (!jstrt) jstrt = ""; // 番地
  callback({
    prefecture: jpref,
    city: jcity,
    area: jarea,
    street: jstrt,
  });
};

fetchRemote = function (nzip, callback) {
  var zip3 = nzip.substr(0, 3);
  var url = JSONDATA + zip3 + ".json";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      CACHE[zip3] = data;
      parse(nzip, data, callback);
    })
    .catch(function () {
      this.dataError = true;
    });
};
