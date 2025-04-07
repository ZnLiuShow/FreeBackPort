// Welcome to qq group: 1030115250
const {decryptData,encryptJSON} = require('./until/aesnet.js');
const {hostaddr, netdata,keyBuffer} = require('./until/host.js');
const crypto = require('crypto');
const {sendEncryptRequest} = require('./login.js');

  async function changepassword(username, newpassword,safepassword) {
    try {
        const init = await sendEncryptRequest();
        const decrypted = decryptData(init.data, keyBuffer, init.iv, init.authTag);
        netdata.aeskey = Buffer.from(decrypted.data, 'base64'); // 明确转换为 Buffer
        const newpasswordHash = crypto.createHash('sha512').update(newpassword).digest('hex');
        const safepasswordHash = crypto.createHash('sha512').update(safepassword).digest('hex');
        const data = { 
            name:username, 
            newpassword:newpasswordHash,
            safepassword:safepasswordHash
        };
        const encryptedData = encryptJSON(data, netdata.aeskey);
        const response = await fetch(`${hostaddr}/api/agents/change`, {
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
        if (deData?.newkey){
            netdata.aeskey = Buffer.from(deData.newkey, 'base64'); // 明确转换为 Buffer
        }
        console.log('修改密码成功:', deData);
        return deData.success;
    }
    catch (error) {
      console.error('修改密码失败:', error); 
      throw error;
    }
  }

  // changepassword('testAdmin', 'MySecret1234','Safe456');

  module.exports = {changepassword};