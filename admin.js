document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Auth Check
    const currentUser = JSON.parse(localStorage.getItem('hydra_currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert("ACCESS DENIED. SUPER ADMIN ONLY.");
        window.location.href = '/index.html';
        return;
    }

    // Global State
    let views = ['dashboard', 'users', 'games', 'news', 'banners'];
    let currentView = 'dashboard';

    // Navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.view;
            renderView();
        });
    });

    renderView();

    function renderView() {
        const container = document.getElementById('view-container');
        const title = document.getElementById('page-title');
        
        switch(currentView) {
            case 'dashboard':
                title.textContent = 'SYSTEM OVERVIEW';
                container.innerHTML = renderDashboard();
                lucide.createIcons();
                break;
            case 'users':
                title.textContent = 'USER MANAGEMENT';
                container.innerHTML = renderUsers();
                lucide.createIcons();
                setupUserEvents();
                break;
            case 'games':
                title.textContent = 'GAME MANAGEMENT';
                container.innerHTML = renderGames();
                lucide.createIcons();
                setupGameEvents();
                break;
            case 'news':
                title.textContent = 'NEWS & ANNOUNCEMENTS';
                container.innerHTML = renderNews();
                lucide.createIcons();
                setupNewsEvents();
                break;
            case 'banners':
                title.textContent = 'BANNER MGT';
                container.innerHTML = renderBanners();
                lucide.createIcons();
                setupBannerEvents();
                break;
        }
    }

    // ================= DASHBOARD =================
    function renderDashboard() {
        const allUsers = JSON.parse(localStorage.getItem('hydra_users')) || [];
        const allGames = JSON.parse(localStorage.getItem('hydra_games')) || [];
        const allNews = JSON.parse(localStorage.getItem('hydra_news')) || [];
        
        const activeUsers = allUsers.filter(u => !u.banned).length;
        const bannedUsers = allUsers.length - activeUsers;

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="stat-card p-6 rounded shadow">
                    <div class="text-gray-400 font-rajdhani mb-2 uppercase text-sm">Total Users</div>
                    <div class="font-orbitron text-4xl text-white">${allUsers.length}</div>
                </div>
                <div class="stat-card p-6 rounded shadow border-l-green-500 before:bg-green-500">
                    <div class="text-gray-400 font-rajdhani mb-2 uppercase text-sm">Active Users</div>
                    <div class="font-orbitron text-4xl text-green-500">${activeUsers}</div>
                </div>
                <div class="stat-card p-6 rounded shadow border-l-red-500 before:bg-red-500">
                    <div class="text-gray-400 font-rajdhani mb-2 uppercase text-sm">Banned Users</div>
                    <div class="font-orbitron text-4xl text-red-500">${bannedUsers}</div>
                </div>
                <div class="stat-card p-6 rounded shadow border-l-blue-500 before:bg-blue-500">
                    <div class="text-gray-400 font-rajdhani mb-2 uppercase text-sm">Total Games</div>
                    <div class="font-orbitron text-4xl text-blue-500">${allGames.length}</div>
                </div>
            </div>
            <div class="bg-[#080808] border border-gray-800 rounded p-6">
                <h3 class="font-orbitron text-lg mb-4 text-cyan-400">SYSTEM LOGS</h3>
                <p class="font-rajdhani text-gray-400 text-sm italic">All systems operating within acceptable parameters. Storage checks complete.</p>
            </div>
        `;
    }

    // ================= USERS =================
    function renderUsers() {
        const allUsers = JSON.parse(localStorage.getItem('hydra_users')) || [];
        
        let rows = allUsers.map((u, index) => {
            const status = u.banned ? '<span class="text-red-500">BANNED</span>' : '<span class="text-green-500">ACTIVE</span>';
            const actionBtn = u.role === 'admin' ? '' : 
                `<button data-idx="${index}" class="ban-btn px-3 py-1 bg-gray-800 text-xs rounded hover:bg-gray-700 font-rajdhani">${u.banned ? 'UNBAN' : 'BAN'}</button>
                 <button data-idx="${index}" class="delete-user-btn px-3 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900 font-rajdhani ml-2">DELETE</button>`;

            return `
                <tr>
                    <td>${u.username}</td>
                    <td><span class="font-mono text-gray-500 text-xs select-all bg-black px-2 py-1 rounded">${u.password}</span></td>
                    <td>${u.role}</td>
                    <td>${status}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="bg-[#080808] border border-gray-800 rounded overflow-hidden">
                <div class="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h3 class="font-orbitron text-lg">REGISTERED USERS</h3>
                    <input type="text" id="user-search" class="admin-input !w-64 !py-2" placeholder="Search users...">
                </div>
                <div class="overflow-x-auto">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Password (Visible)</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function setupUserEvents() {
        document.querySelectorAll('.ban-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.idx;
                const allUsers = JSON.parse(localStorage.getItem('hydra_users'));
                allUsers[idx].banned = !allUsers[idx].banned;
                localStorage.setItem('hydra_users', JSON.stringify(allUsers));
                renderView();
            });
        });
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.idx;
                const allUsers = JSON.parse(localStorage.getItem('hydra_users'));
                if(confirm(`Delete user ${allUsers[idx].username}?`)) {
                    allUsers.splice(idx, 1);
                    localStorage.setItem('hydra_users', JSON.stringify(allUsers));
                    renderView();
                }
            });
        });
        
        const searchInput = document.getElementById('user-search');
        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const trs = document.getElementById('users-tbody').querySelectorAll('tr');
                trs.forEach(tr => {
                    const name = tr.cells[0].textContent.toLowerCase();
                    tr.style.display = name.includes(term) ? '' : 'none';
                });
            });
        }
    }

    // ================= GAMES =================
    function renderGames() {
        const games = JSON.parse(localStorage.getItem('hydra_games')) || [];
        let rows = games.map((g, idx) => `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <img src="${g.image}" class="w-10 h-10 object-cover rounded border border-gray-700">
                        <span class="font-bold">${g.title}</span>
                    </div>
                </td>
                <td>${g.category}</td>
                <td>${g.rating}</td>
                <td>
                    ${g.featured ? '<span class="text-cyan-400 text-xs border border-cyan-400 px-1 mr-1">FEAT</span>' : ''}
                    ${g.trending ? '<span class="text-orange-400 text-xs border border-orange-400 px-1">TREND</span>' : ''}
                </td>
                <td>
                    <button data-idx="${idx}" class="edit-game-btn px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded hover:bg-blue-900">EDIT</button>
                    <button data-idx="${idx}" class="del-game-btn px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900 ml-1">DEL</button>
                </td>
            </tr>
        `).join('');

        return `
            <div class="mb-6 flex justify-end">
                <button id="add-game-btn" class="font-orbitron px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors flex items-center gap-2 text-sm">
                    <i data-lucide="plus" class="w-4 h-4"></i> ADD NEW GAME
                </button>
            </div>
            <div class="bg-[#080808] border border-gray-800 rounded overflow-hidden">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Game Subject</th>
                            <th>Category</th>
                            <th>Rating</th>
                            <th>Tags</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    function setupGameEvents() {
        document.getElementById('add-game-btn').addEventListener('click', () => {
            openModal('ADD NEW GAME', gameFormTemplate());
            document.getElementById('game-form').addEventListener('submit', handleGameSubmit);
        });

        document.querySelectorAll('.edit-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.idx;
                const games = JSON.parse(localStorage.getItem('hydra_games'));
                openModal('EDIT GAME', gameFormTemplate(games[idx], idx));
                document.getElementById('game-form').addEventListener('submit', (ev) => handleGameSubmit(ev, idx));
            });
        });

        document.querySelectorAll('.del-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.idx;
                const games = JSON.parse(localStorage.getItem('hydra_games'));
                if(confirm(`Delete ${games[idx].title}?`)) {
                    games.splice(idx, 1);
                    localStorage.setItem('hydra_games', JSON.stringify(games));
                    renderView();
                }
            });
        });
    }

    function gameFormTemplate(game = null, index = -1) {
        return `
            <form id="game-form" class="space-y-4">
                <input type="hidden" id="g-idx" value="${index}">
                <div><label class="text-xs text-gray-400">TITLE</label><input type="text" id="g-title" class="admin-input" required value="${game ? game.title : ''}"></div>
                <div><label class="text-xs text-gray-400">DESCRIPTION</label><textarea id="g-desc" class="admin-input" required rows="3">${game ? game.desc : ''}</textarea></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-xs text-gray-400">CATEGORY</label><input type="text" id="g-cat" class="admin-input" required value="${game ? game.category : ''}"></div>
                    <div><label class="text-xs text-gray-400">RATING (e.g. 4.5)</label><input type="text" id="g-rating" class="admin-input" required value="${game ? game.rating : ''}"></div>
                </div>
                <div><label class="text-xs text-gray-400">IMAGE URL</label><input type="text" id="g-img" class="admin-input" required value="${game ? game.image : ''}"></div>
                <div><label class="text-xs text-gray-400">PLAY STORE URL</label><input type="text" id="g-url" class="admin-input" required value="${game ? game.link : ''}"></div>
                <div class="flex gap-4 pt-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="g-feat" ${game && game.featured ? 'checked' : ''}> Featured (Slider)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="g-trend" ${game && game.trending ? 'checked' : ''}> Trending</label>
                </div>
                <button type="submit" class="w-full mt-4 bg-cyan-600 font-orbitron py-3 rounded text-white hover:bg-cyan-500">SAVE GAME</button>
            </form>
        `;
    }

    function handleGameSubmit(e, editIndex = -1) {
        e.preventDefault();
        const games = JSON.parse(localStorage.getItem('hydra_games')) || [];
        const newGame = {
            id: editIndex >= 0 ? games[editIndex].id : Date.now(),
            title: document.getElementById('g-title').value,
            desc: document.getElementById('g-desc').value,
            category: document.getElementById('g-cat').value,
            rating: document.getElementById('g-rating').value,
            image: document.getElementById('g-img').value,
            link: document.getElementById('g-url').value,
            featured: document.getElementById('g-feat').checked,
            trending: document.getElementById('g-trend').checked
        };
        if(editIndex >= 0) {
            games[editIndex] = newGame;
        } else {
            games.push(newGame);
        }
        localStorage.setItem('hydra_games', JSON.stringify(games));
        closeModal();
        renderView();
    }

    // ================= NEWS =================
    // Similar boilerplate for news mapping over hydra_news
    function renderNews() {
        const news = JSON.parse(localStorage.getItem('hydra_news')) || [];
        let rows = news.map((n, idx) => `
            <tr>
                <td><span class="text-xs text-gray-400">${n.date}</span><br><b>${n.title}</b></td>
                <td>${n.type}</td>
                <td>
                    <button data-idx="${idx}" class="del-news-btn px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900">DEL</button>
                </td>
            </tr>
        `).join('');
        return `
            <div class="mb-6 flex justify-end">
                <button id="add-news-btn" class="font-orbitron px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors flex items-center gap-2 text-sm">
                    <i data-lucide="plus" class="w-4 h-4"></i> POST NEWS
                </button>
            </div>
            <div class="bg-[#080808] border border-gray-800 rounded">
                <table class="data-table">
                    <thead><tr><th>Headline</th><th>Type</th><th>Actions</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }
    
    function setupNewsEvents() {
        document.getElementById('add-news-btn').addEventListener('click', () => {
            openModal('POST NEWS', `
                <form id="news-form" class="space-y-4">
                    <div><label class="text-xs">TITLE</label><input type="text" id="n-title" class="admin-input" required></div>
                    <div><label class="text-xs">TYPE (News/Update/Tournament)</label><input type="text" id="n-type" class="admin-input" required></div>
                    <div><label class="text-xs">CONTENT</label><textarea id="n-content" class="admin-input" required rows="4"></textarea></div>
                    <button type="submit" class="w-full bg-cyan-600 py-2 rounded">PUBLISH</button>
                </form>
            `);
            document.getElementById('news-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const news = JSON.parse(localStorage.getItem('hydra_news')) || [];
                news.unshift({
                    id: Date.now(),
                    title: document.getElementById('n-title').value,
                    type: document.getElementById('n-type').value,
                    content: document.getElementById('n-content').value,
                    date: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
                });
                localStorage.setItem('hydra_news', JSON.stringify(news));
                closeModal();
                renderView();
            });
        });
        document.querySelectorAll('.del-news-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.idx;
                const news = JSON.parse(localStorage.getItem('hydra_news'));
                news.splice(idx, 1);
                localStorage.setItem('hydra_news', JSON.stringify(news));
                renderView();
            });
        });
    }

    // ================= BANNERS =================
    function renderBanners() {
        const banners = JSON.parse(localStorage.getItem('hydra_banners')) || [];
        return `
            <div class="bg-[#080808] border border-gray-800 rounded p-6 max-w-2xl">
                <h3 class="font-orbitron text-lg mb-4">HERO BACKGROUND URL</h3>
                <div class="flex gap-4">
                    <input type="text" id="banner-input" class="admin-input flex-1" value="${banners[0] || ''}" placeholder="Enter direct image URL">
                    <button id="save-banner" class="bg-cyan-600 px-6 rounded hover:bg-cyan-500 font-orbitron text-sm">UPDATE</button>
                </div>
                <div class="mt-6 border border-gray-800 rounded h-64 overflow-hidden relative">
                    <img src="${banners[0] || ''}" class="w-full h-full object-cover opacity-50" id="banner-preview">
                    <div class="absolute inset-0 flex items-center justify-center text-gray-500 font-orbitron opacity-50">PREVIEW</div>
                </div>
            </div>
        `;
    }
    
    function setupBannerEvents() {
        document.getElementById('save-banner').addEventListener('click', () => {
            const val = document.getElementById('banner-input').value;
            const banners = JSON.parse(localStorage.getItem('hydra_banners')) || [];
            banners[0] = val;
            localStorage.setItem('hydra_banners', JSON.stringify(banners));
            document.getElementById('banner-preview').src = val;
            alert("Banner updated! Will reflect on homepage.");
        });
    }

    // ================= MODAL =================
    function openModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        
        const modal = document.getElementById('admin-modal');
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }

    function closeModal() {
        const modal = document.getElementById('admin-modal');
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', closeModal);

});

window.logout = function() {
    localStorage.removeItem('hydra_currentUser');
    window.location.href = '/index.html';
}
