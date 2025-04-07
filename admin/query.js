const {decryptData,encryptJSON} = require('./until/aesnet.js');
const {hostaddr, netdata} = require('./until/host.js');


async function queryGenKeyCards(token, begin, end) {
    try {
        const data = { 
            token:token, 
            begin:begin,
            end:end,
            mode:'generate'
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/cards/query`, {
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
        console.log('Succeeded in querying production encryption. Procedure:', deData);
        return {status:deData.success,cards:deData.cards};
    }
    catch (error) {
      console.error('Failed to query the production encryption. Procedure:', error); 
      throw error;
    }
  }

  async function queryActivateKeyCards(token, begin, end) {
    try {
        const data = { 
            token:token, 
            begin:begin,
            end:end,
            mode:'activate'
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/cards/query`, {
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
        console.log('Succeeded in querying activate encryption. Procedure:', deData);
        return {status:deData.success,cards:deData.cards};
    }
    catch (error) {
      console.error('Failed to query the activate encryption. Procedure:', error); 
      throw error;
    }
  }


  module.exports = {queryGenKeyCards,queryActivateKeyCards};