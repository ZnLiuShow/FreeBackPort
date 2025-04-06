const {decryptData,encryptJSON} = require('./until/aesnet.js');
const {hostaddr, netdata} = require('./until/host.js');
const crypto = require('crypto');

const keyBuffer = crypto.randomBytes(32); // 256 位密钥
async function sendEncryptRequest() {  
  // 转换为Base64字符串
  const keyBase64 = keyBuffer.toString('base64');

  try {
    const response = await fetch(`${hostaddr}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: keyBase64 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`请求失败: ${errorData.error} (原因: ${errorData.reason})`);
    }

    const responseData = await response.json();
    console.log('链接成功:', responseData);
    return responseData;
  } catch (error) {
    console.error('调用加密接口出错:', error);
    throw error;
  }
}

  async function login(username, password) {
    try {
        const init = await sendEncryptRequest();
        const decrypted = decryptData(init.data, keyBuffer, init.iv, init.authTag);
        netdata.aeskey = Buffer.from(decrypted.data, 'base64'); // 明确转换为 Buffer
        const data = { 
            name:username, 
            password:password 
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(encryptedData),
          });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`请求失败: ${errorData.error} (原因: ${errorData.reason})`);
        }
    
        const responseData = await response.json();
        console.log('链接成功:', responseData);
        return responseData;
    }
    catch (error) {
      console.error('登录失败:', error); 
      throw error;
    }
  }

  login('admin', '123456')