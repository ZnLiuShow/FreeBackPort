
const crypto = require('crypto');


module.exports = { 
  hostaddr:"http://localhost:3000", 
  netdata:{
    mytoken: "",
    aeskey: null,
  },
  keyBuffer: crypto.randomBytes(32)
};