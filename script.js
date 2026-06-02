// 当前选中的角色
let currentRole = 'admin';

// 切换角色
function switchRole(role) {
    currentRole = role;
    
    // 更新tab样式
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-role="${role}"]`).classList.add('active');
    
    // 隐藏所有登录方式
    document.querySelectorAll('.login-method').forEach(method => {
        method.style.display = 'none';
    });
    
    // 显示当前角色的登录方式
    document.getElementById(`${role}Login`).style.display = 'block';
    
    // 清空消息
    hideMessage();
}

// 处理OA登录
function handleOALogin() {
    showMessage('正在跳转到OA登录...', 'info');
    
    // 模拟OA登录流程
    setTimeout(() => {
        // 模拟OA认证成功
        const mockOAResponse = {
            success: true,
            user: {
                id: 'admin_001',
                name: '管理员张三',
                role: 'admin',
                email: 'zhangsan@company.com'
            }
        };
        
        if (mockOAResponse.success) {
            showMessage('OA登录成功！正在跳转...', 'success');
            
            // 保存用户信息到localStorage
            localStorage.setItem('user', JSON.stringify(mockOAResponse.user));
            
            // 模拟跳转
            setTimeout(() => {
                alert(`欢迎回来，${mockOAResponse.user.name}！\n\n角色：运营后台管理员\n\n（这是演示，实际应跳转到后台首页）`);
                // window.location.href = '/dashboard';
            }, 1000);
        }
    }, 1500);
}

// 处理表单提交（代理和网吧主登录）
function handleLogin(event) {
    event.preventDefault();
    
    let account, password;
    
    if (currentRole === 'agent') {
        account = document.getElementById('agentAccount').value;
        password = document.getElementById('agentPassword').value;
    } else if (currentRole === 'owner') {
        account = document.getElementById('ownerAccount').value;
        password = document.getElementById('ownerPassword').value;
    }
    
    // 验证输入
    if (!account || !password) {
        showMessage('请输入账号和密码', 'error');
        return;
    }
    
    showMessage('正在登录...', 'info');
    
    // 模拟登录请求
    setTimeout(() => {
        // 模拟登录验证
        const mockLoginResponse = authenticate(account, password, currentRole);
        
        if (mockLoginResponse.success) {
            showMessage('登录成功！正在跳转...', 'success');
            
            // 保存用户信息
            localStorage.setItem('user', JSON.stringify(mockLoginResponse.user));
            
            // 如果勾选了记住账号
            if (currentRole === 'owner' && document.getElementById('remember').checked) {
                localStorage.setItem('rememberedAccount', account);
            }
            
            // 模拟跳转
            setTimeout(() => {
                const roleNames = {
                    'admin': '运营后台',
                    'agent': '代理',
                    'owner': '网吧主'
                };
                alert(`欢迎回来，${mockLoginResponse.user.name}！\n\n角色：${roleNames[currentRole]}\n\n（这是演示，实际应跳转到后台首页）\n\n功能说明：\n${getRoleFeatures(currentRole)}`);
                // window.location.href = '/dashboard';
            }, 1000);
        } else {
            showMessage(mockLoginResponse.message || '登录失败，请检查账号密码', 'error');
        }
    }, 1500);
}

// 模拟认证
function authenticate(account, password, role) {
    // 模拟数据库中的用户
    const mockUsers = {
        'agent': [
            { id: 'agent_001', account: 'agent001', password: '123456', name: '代理李四', role: 'agent' }
        ],
        'owner': [
            { id: 'owner_001', account: 'owner001', password: '123456', name: '网吧主王五', role: 'owner', agentId: 'agent_001' }
        ]
    };
    
    const users = mockUsers[role] || [];
    const user = users.find(u => u.account === account && u.password === password);
    
    if (user) {
        return {
            success: true,
            user: user
        };
    } else {
        return {
            success: false,
            message: '账号或密码错误'
        };
    }
}

// 获取角色功能说明
function getRoleFeatures(role) {
    const features = {
        'admin': '- 管理所有代理和网吧主\n- 查看全平台数据\n- 系统配置',
        'agent': '- 查看名下所有网吧主数据\n- 结算管理\n- 数据统计',
        'owner': '- 查看网吧营业数据\n- 结算查询\n- 账号管理'
    };
    return features[role] || '';
}

// 显示消息
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
}

// 隐藏消息
function hideMessage() {
    const messageEl = document.getElementById('message');
    messageEl.style.display = 'none';
}

// 页面加载时检查是否有记住的账号
window.addEventListener('DOMContentLoaded', () => {
    const rememberedAccount = localStorage.getItem('rememberedAccount');
    if (rememberedAccount) {
        document.getElementById('ownerAccount').value = rememberedAccount;
        document.getElementById('remember').checked = true;
    }
    
    // 检查是否已经登录
    const user = localStorage.getItem('user');
    if (user) {
        const userInfo = JSON.parse(user);
        if (confirm(`检测到您已登录（${userInfo.name}），是否继续？`)) {
            // 继续会话
        } else {
            // 清除登录状态
            localStorage.removeItem('user');
        }
    }
});
