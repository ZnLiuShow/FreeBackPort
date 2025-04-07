// Welcome to qq group: 1030115250
document.addEventListener('DOMContentLoaded', () => {
    // 绑定标签切换事件
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // 移除所有标签的激活状态
            tabs.forEach((t) => t.classList.remove('active'));
            // 隐藏所有标签页内容
            tabContents.forEach((content) => content.classList.remove('active'));

            // 添加当前点击标签的激活状态
            tab.classList.add('active');
            // 显示对应的标签页内容
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // 查询标签页相关操作
    const queryTab = document.getElementById('query');
    if (queryTab) {
        const startDateInput = queryTab.querySelector('#startDate');
        const endDateInput = queryTab.querySelector('#endDate');
        const dateTypeSelect = queryTab.querySelector('#dateType');
        const queryButton = queryTab.querySelector('button');
        const recordCountLabel = queryTab.querySelector('#recordCount');
        const queryTableBody = queryTab.querySelector('tbody');

        queryButton.addEventListener('click', () => {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            const dateType = dateTypeSelect.value;

            // 这里可以添加查询逻辑，例如发送请求到服务器获取数据
            // 示例：模拟查询结果
            const mockData = [
                { id: 1, cardCode: 'ABC123', generationTime: '2024-01-01', activationTime: '2024-01-02', generator: 'User1', user: 'User2' },
                { id: 2, cardCode: 'DEF456', generationTime: '2024-01-03', activationTime: '2024-01-04', generator: 'User3', user: 'User4' }
            ];

            // 清空表格内容
            queryTableBody.innerHTML = '';

            // 填充表格数据
            mockData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.cardCode}</td>
                    <td>${item.generationTime}</td>
                    <td>${item.activationTime}</td>
                    <td>${item.generator}</td>
                    <td>${item.user}</td>
                `;
                queryTableBody.appendChild(row);
            });

            // 更新记录数量
            recordCountLabel.textContent = mockData.length;
        });
    }

    // 管理标签页相关操作
    const manageTab = document.getElementById('manage');
    if (manageTab) {
        const manageTableBody = manageTab.querySelector('tbody');
        const clearExpiredButton = manageTab.querySelector('button:nth-of-type(1)');
        const operateAllButton = manageTab.querySelector('button:nth-of-type(2)');

        // 模拟管理表格数据
        const manageMockData = [
            { id: 1, user: 'User1', createTime: '2024-01-01', serviceDuration: '1 month', status: '正常' },
            { id: 2, user: 'User2', createTime: '2024-01-02', serviceDuration: '2 months', status: '封禁' }
        ];

        // 填充管理表格数据
        manageMockData.forEach(item => {
            const row = document.createElement('tr');
            const statusSelect = document.createElement('select');
            const statusOptions = ['正常', '封禁', '删除'];
            statusOptions.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                if (optionText === item.status) {
                    option.selected = true;
                }
                statusSelect.appendChild(option);
            });

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.user}</td>
                <td>${item.createTime}</td>
                <td>${item.serviceDuration}</td>
            `;
            row.appendChild(statusSelect);
            manageTableBody.appendChild(row);
        });

        clearExpiredButton.addEventListener('click', () => {
            // 这里可以添加一键清理所有过期用户的逻辑
            console.log('清理所有过期用户');
        });

        operateAllButton.addEventListener('click', () => {
            // 这里可以添加一键操作所有的逻辑
            console.log('一键操作所有');
        });
    }

    // 生成标签页相关操作
    const generateTab = document.getElementById('generate');
    if (generateTab) {
        const cardTypeSelect = generateTab.querySelector('#cardType');
        const generateCountInput = generateTab.querySelector('#generateCount');
        const generateButton = generateTab.querySelector('#generateButton');
        const generatedCardsTextarea = generateTab.querySelector('#generatedCards');
        const saveButton = generateTab.querySelector('#saveButton');

        generateButton.addEventListener('click', async() => {
            try {
                const cardType = cardTypeSelect.value;
                const generateCount = parseInt(generateCountInput.value);
                // 定义卡类型和对应时长的映射
                const cardDurationMap = {
                    "hourCard": 1,
                    "dayCard": 24,
                    "weekCard": 24 * 7,
                    "monthCard": 24 * 30,
                    "quarterCard": 24 * 120,
                    "yearCard": 24 * 360
                };
                const d_type = cardDurationMap[cardType];
                const cards = await window.electronAPI.genKeyCards(generateCount,d_type);
                if (!cards?.status) {
                    throw new Error(`Failed to generate encryption`);            
                }      
                generatedCardsTextarea.value = cards.keys.join('\n');
            }
            catch (error) {
                console.error('生成卡密出错:', error);
                alert(`生成卡密出错: ${error.message}`); 
            }            
        });

        saveButton.addEventListener('click', async () => {
            const content = generatedCardsTextarea.value;
            const result = await window.electronAPI.saveFile(content);
            if (result) {
                alert('文件保存成功');
            } else {
                alert('文件保存失败');
            }
        });
    }
});