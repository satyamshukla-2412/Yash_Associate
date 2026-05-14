// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Load initial data
    fetchMessages();
    fetchCMSContent();

    // CMS Form submit listener
    const cmsForm = document.getElementById('cmsForm');
    if (cmsForm) {
        cmsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveCMSContent();
        });
    }
});

function switchTab(tabId) {
    document.getElementById('dashboardTab').style.display = tabId === 'dashboard' ? 'block' : 'none';
    document.getElementById('editorTab').style.display = tabId === 'editor' ? 'block' : 'none';
    document.getElementById('pageTitle').textContent = tabId === 'dashboard' ? 'Messages' : 'Website Editor';
    
    // Update active class
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

async function fetchMessages() {
    try {
        const response = await fetch('/api/get-messages');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('messagesTableBody');
            const msgCount = document.getElementById('totalMsgCount');
            
            if (msgCount) msgCount.textContent = data.data.length;
            
            if (data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">No messages yet.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            data.data.forEach(msg => {
                const date = new Date(msg.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${msg.name}</td>
                    <td>${msg.email}<br><small>${msg.phone}</small></td>
                    <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${msg.message}">${msg.message}</td>
                    <td>${date}</td>
                    <td>
                        <select onchange="updateMessageStatus('${msg._id}', this.value)" style="padding:4px; border-radius:4px; background:transparent; color:var(--text-primary); border:1px solid rgba(255,255,255,0.2);">
                            <option value="new" ${msg.status==='new'?'selected':''} style="color:black;">New</option>
                            <option value="read" ${msg.status==='read'?'selected':''} style="color:black;">Read</option>
                            <option value="replied" ${msg.status==='replied'?'selected':''} style="color:black;">Replied</option>
                        </select>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error('Failed to load messages');
    }
}

async function updateMessageStatus(id, status) {
    try {
        await fetch('/api/update-message-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
    } catch (e) {
        alert('Failed to update status');
    }
}

async function fetchCMSContent() {
    try {
        const response = await fetch('/api/get-content');
        const data = await response.json();
        
        if (data.success && data.data) {
            const content = data.data;
            document.getElementById('heroTitle').value = content.heroTitle || '';
            document.getElementById('heroSubtitle').value = content.heroSubtitle || '';
            document.getElementById('heroDescription').value = content.heroDescription || '';
            document.getElementById('aboutTitle').value = content.aboutTitle || '';
            document.getElementById('aboutText').value = content.aboutText || '';
            document.getElementById('address').value = content.address || '';
            document.getElementById('phone').value = content.phone || '';
            document.getElementById('email').value = content.email || '';
        }
    } catch (e) {
        console.error('Failed to load CMS content');
    }
}

async function saveCMSContent() {
    const btn = document.getElementById('saveCmsBtn');
    const loader = document.getElementById('cmsLoader');
    const btnText = document.querySelector('#saveCmsBtn .btn-text');
    const msg = document.getElementById('cmsMessage');

    btn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    
    const content = {
        heroTitle: document.getElementById('heroTitle').value,
        heroSubtitle: document.getElementById('heroSubtitle').value,
        heroDescription: document.getElementById('heroDescription').value,
        aboutTitle: document.getElementById('aboutTitle').value,
        aboutText: document.getElementById('aboutText').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('/api/update-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content)
        });
        
        const data = await response.json();
        if (data.success) {
            msg.textContent = 'Changes Saved Live Successfully!';
            msg.style.color = '#4cc986';
        } else {
            msg.textContent = 'Failed to save changes.';
            msg.style.color = '#ff6b6b';
        }
    } catch (e) {
        msg.textContent = 'Network error.';
        msg.style.color = '#ff6b6b';
    }

    btn.disabled = false;
    btnText.style.display = 'inline-block';
    loader.style.display = 'none';
    
    setTimeout(() => { msg.textContent = ''; }, 3000);
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/admin/login.html';
    } catch (e) {
        window.location.href = '/admin/login.html';
    }
}
