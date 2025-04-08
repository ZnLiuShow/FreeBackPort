// Welcome to qq group: 1030115250
const {decryptData,encryptJSON} = require('./until/aesnet.js');
const {hostaddr, netdata} = require('./until/host.js');
/*
{
usercrc64: BigInt("18446744073709551615"), // 用户的 CRC64 校验码，用于标识用户的身份。
operate: [0, 1, 2].includes
}
*/
async function manageUsers(operations) {
    try {
        const data = { 
            token:netdata.mytoken, 
            operations:operations,
            timestamp:Date.now(),
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/agents/manage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(encryptedData)
          });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`请求失败: ${errorData.error} (原因: ${errorData.reason})`);
        }
    
        const responseData = await response.json();
        const deData = decryptData(responseData.data, netdata.aeskey, responseData.iv, responseData.tag);
        if (deData?.token) {
            netdata.mytoken = responseData.token; // 存储 token
        }
        if (deData?.newkey){
            netdata.aeskey = Buffer.from(deData.newkey, 'base64'); // 明确转换为 Buffer
        }
        console.log('The one-click operation succeeds:', deData);
        return {status:deData.success,operand:deData.operatenum};
    }
    catch (error) {
      console.error('The one-click operation failed:', error); 
      throw error;
    }
  }

  async function queryUsers(mode) {
    try {
        validFields = ['all', 'self', 'mine']
        if (!validFields.includes(mode)){
            throw new Error(`Invalid mode: ${mode}`); 
        }
        const data = { 
            token:netdata.mytoken, 
            mode:mode,
            timestamp:Date.now(),
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/agents/getusers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(encryptedData)
          });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`请求失败: ${errorData.error} (原因: ${errorData.reason})`);
        }
    
        const responseData = await response.json();
        const deData = decryptData(responseData.data, netdata.aeskey, responseData.iv, responseData.tag);
        if (deData?.token) {
            netdata.mytoken = responseData.token; // 存储 token
        }
        if (deData?.newkey){
            netdata.aeskey = Buffer.from(deData.newkey, 'base64'); // 明确转换为 Buffer
        }
        console.log('Querying user information succeeds:', deData);
        return {status:deData.success,users:deData.users};
    }
    catch (error) {
      console.error('Querying user information failed:', error); 
      throw error;
    }
  }

  module.exports = {manageUsers,queryUsers};