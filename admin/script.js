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

function switchMainTab(tabId) {
    document.getElementById('dashboardTab').style.display = tabId === 'dashboard' ? 'block' : 'none';
    document.getElementById('editorTab').style.display = tabId === 'editor' ? 'block' : 'none';
    document.getElementById('pageTitle').textContent = tabId === 'dashboard' ? 'Messages' : 'Website Editor';
    
    // Update active class
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
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
                    <td>
                        <a href="mailto:${msg.email}" style="color:var(--gold-light); text-decoration:none;">${msg.email}</a><br>
                        <small><a href="tel:${msg.phone}" style="color:var(--text-secondary); text-decoration:none;">${msg.phone}</a></small>
                    </td>
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
            const setVal = (id, field) => {
                const el = document.getElementById(id);
                if (el) el.value = content[field] || '';
            };

            // Texts
            setVal('heroTitle', 'heroTitle');
            setVal('heroSubtitle', 'heroSubtitle');
            setVal('heroDescription', 'heroDescription');
            setVal('aboutTitle', 'aboutTitle');
            setVal('aboutText', 'aboutText');
            setVal('teamCount', 'teamCount');
            setVal('teamText', 'teamText');
            setVal('address', 'address');
            setVal('phone', 'phone');
            setVal('email', 'email');

            // Images
            setVal('heroBgImg', 'heroBgImg');
            setVal('heroPortraitImg', 'heroPortraitImg');
            setVal('aboutBgImg', 'aboutBgImg');
            setVal('aboutPortraitImg', 'aboutPortraitImg');
            setVal('practiceBgImg', 'practiceBgImg');
            setVal('courtsBgImg', 'courtsBgImg');
            setVal('clientsBgImg', 'clientsBgImg');
            setVal('teamBgImg', 'teamBgImg');
            setVal('dividerBgImg', 'dividerBgImg');

            // Lists
            setVal('practiceAreasText', 'practiceAreasText');
            setVal('courtsText', 'courtsText');
            setVal('clientsText', 'clientsText');
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
    
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };

    const content = {
        // Texts
        heroTitle: getVal('heroTitle'),
        heroSubtitle: getVal('heroSubtitle'),
        heroDescription: getVal('heroDescription'),
        aboutTitle: getVal('aboutTitle'),
        aboutText: getVal('aboutText'),
        teamCount: getVal('teamCount'),
        teamText: getVal('teamText'),
        address: getVal('address'),
        phone: getVal('phone'),
        email: getVal('email'),
        // Images
        heroBgImg: getVal('heroBgImg'),
        heroPortraitImg: getVal('heroPortraitImg'),
        aboutBgImg: getVal('aboutBgImg'),
        aboutPortraitImg: getVal('aboutPortraitImg'),
        practiceBgImg: getVal('practiceBgImg'),
        courtsBgImg: getVal('courtsBgImg'),
        clientsBgImg: getVal('clientsBgImg'),
        teamBgImg: getVal('teamBgImg'),
        dividerBgImg: getVal('dividerBgImg'),
        // Lists
        practiceAreasText: getVal('practiceAreasText'),
        courtsText: getVal('courtsText'),
        clientsText: getVal('clientsText')
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
