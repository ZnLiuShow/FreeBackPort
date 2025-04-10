// Welcome to qq group: 1030115250
const crypto = require('crypto');


module.exports = { 
  hostaddr:"http://101.43.17.19", 
  netdata:{
    mytoken: "",
    aeskey: null,
  },
  keyBuffer: crypto.randomBytes(32)
};