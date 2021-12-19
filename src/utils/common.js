exports.checkQuery = (...rest) => {
    const { _page, _limit, name, categoryId, color, size, price } = rest;

    if(_page && _limit){
        
    }

};
exports.numberWithCommas = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';

exports.sortObject=(obj)=> {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
exports.reduceArr = (array) => {
  var result = [];
  array.reduce(function (res, value) {
    if (!res[value.productId]) {
      res[value.productId] = { productId: value.productId, quantity: 0 };
      result.push(res[value.productId]);
    }
    res[value.productId].quantity += value.quantity;
    return res;
  }, {});
  return result;
};

exports.productionConfig = function (){
  return (result =
    process.env.ENVIROMENT === 'PRODUCTION'
      ? process.env.URL
      : process.env.local);

}