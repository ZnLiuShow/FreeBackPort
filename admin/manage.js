// Welcome to qq group: 1030115250
const {decryptData,encryptJSON} = require('./until/aesnet.js');
const {hostaddr, netdata} = require('./until/host.js');

async function manageUsers(operations) {
    try {
        const data = { 
            token:netdata.mytoken, 
            operations:operations,
            timestamp:Date.now(),
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/agents/query`, {
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


  module.exports = {manageUsers};