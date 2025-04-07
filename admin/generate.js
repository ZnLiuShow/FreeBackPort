const {decryptData,encryptJSON} = require('./until/aesnet.js');
const {hostaddr, netdata} = require('./until/host.js');


async function genKeyCards(token, num, type) {
    try {
        const data = { 
            token:token, 
            num:num,
            type:type,
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/cards`, {
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
        console.log('生成卡密成功:', deData);
        return {status:deData.success,keys:deData.keys};
    }
    catch (error) {
      console.error('生成卡密失败:', error); 
      throw error;
    }
  }

  module.exports = {genKeyCards};