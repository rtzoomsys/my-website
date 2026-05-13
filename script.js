// Data Initialization and LocalStorage Management
const DEFAULT_GAMES = [
    { id: 1, title: 'Free Fire', category: 'Battle Royale', rating: '4.5', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.dts.freefireth', trending: true, featured: true, desc: 'Survival battle royale shooter game.' },
    { id: 2, title: 'Call of Duty Mobile', category: 'Action', rating: '4.7', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter', trending: true, featured: true, desc: 'Classic multiplayer and battle royale.' },
    { id: 3, title: 'BGMI', category: 'Battle Royale', rating: '4.6', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.pubg.imobile', trending: true, featured: true, desc: 'India\'s favourite battle royale game.' },
    { id: 4, title: 'Minecraft', category: 'Sandbox', rating: '4.8', image: 'https://images.unsplash.com/photo-1607513746994-6b94e7751965?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe', trending: false, featured: true, desc: 'Explore infinite worlds and build everything.' },
    { id: 5, title: 'Roblox', category: 'Adventure', rating: '4.4', image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.roblox.client', trending: false, featured: true, desc: 'Virtual universe to play and create.' },
    { id: 6, title: 'Asphalt 9', category: 'Racing', rating: '4.5', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.gameloft.android.ANMP.GloftA9HM', trending: true, featured: false, desc: 'Hyper-realistic arcade racing game.' },
    { id: 7, title: 'Clash of Clans', category: 'Strategy', rating: '4.6', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=600&auto=format&fit=crop', link: 'https://play.google.com/store/apps/details?id=com.supercell.clashofclans', trending: false, featured: false, desc: 'Epic combat strategy game.' }
];

const DEFAULT_NEWS = [
    { id: 1, title: 'HYDRAS Season 5 Tournament Announced', date: 'Oct 24, 2026', type: 'Tournament', content: 'Get ready for the biggest prize pool in HYDRAS history. Registrations open next week.' },
    { id: 2, title: 'Platform Update v2.0 Live', date: 'Oct 20, 2026', type: 'Update', content: 'New UI, faster downloads, and advanced player stats tracking added.' },
    { id: 3, title: 'Free Fire Weekend XP Boost', date: 'Oct 18, 2026', type: 'Event', content: 'Double XP for all Free Fire players this weekend.' }
];

const DEFAULT_TOURNAMENTS = [
    { id: 1, title: 'CODM Elite Series', prize: '$10,000', slots: '64/128', date: 'Nov 1, 2026', game: 'Call of Duty Mobile' },
    { id: 2, title: 'BGMI Showdown', prize: '$15,000', slots: '98/100', date: 'Nov 15, 2026', game: 'BGMI' }
];

const DEFAULT_BANNERS = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop'
];

// DB Init
function initDB() {
    if (!localStorage.getItem('hydra_games')) localStorage.setItem('hydra_games', JSON.stringify(DEFAULT_GAMES));
    if (!localStorage.getItem('hydra_news')) localStorage.setItem('hydra_news', JSON.stringify(DEFAULT_NEWS));
    if (!localStorage.getItem('hydra_tournaments')) localStorage.setItem('hydra_tournaments', JSON.stringify(DEFAULT_TOURNAMENTS));
    if (!localStorage.getItem('hydra_banners')) localStorage.setItem('hydra_banners', JSON.stringify(DEFAULT_BANNERS));
    if (!localStorage.getItem('hydra_users')) {
        localStorage.setItem('hydra_users', JSON.stringify([
            { username: 'admin', password: 'admin@121', role: 'admin', xp: 9999, rank: 'HYDRAS LORD', banned: false }
        ]));
    }
}
initDB();

// Global State
const currentUser = JSON.parse(localStorage.getItem('hydra_currentUser'));
const games = JSON.parse(localStorage.getItem('hydra_games'));
const news = JSON.parse(localStorage.getItem('hydra_news'));
const tournaments = JSON.parse(localStorage.getItem('hydra_tournaments'));
const allUsers = JSON.parse(localStorage.getItem('hydra_users'));

// UI Event Listeners & Logic
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupAuthModal();
    setupSearchModal();
    checkAuth();
    renderHomePageData();
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});

function setupNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

function checkAuth() {
    const desktopAuth = document.getElementById('auth-buttons');
    const mobileAuth = document.getElementById('mobile-auth-buttons');
    
    if (currentUser) {
        // Logged in View
        const isSuperAdmin = currentUser.role === 'admin';
        const dashboardLink = isSuperAdmin ? '/admin.html' : '/dashboard.html';
        const dashboardText = isSuperAdmin ? 'ADMIN PANEL' : 'DASHBOARD';
        
        desktopAuth.innerHTML = `
            <a href="${dashboardLink}" class="font-orbitron px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all text-sm font-bold tracking-wider">${dashboardText}</a>
            <button onclick="logout()" class="font-orbitron px-4 py-2 border border-red-500/50 text-red-500 rounded hover:bg-red-500/10 transition-all text-sm font-bold">LOGOUT</button>
        `;
        
        mobileAuth.innerHTML = `
            <a href="${dashboardLink}" class="block px-3 py-2 text-cyan-400 font-bold">${dashboardText}</a>
            <button onclick="logout()" class="text-left w-full block px-3 py-2 text-red-500">LOGOUT</button>
        `;
    } else {
        // Logged out View
        const loginBtn = `<button onclick="document.getElementById('login-modal-btn').click()" class="font-orbitron px-6 py-2 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/10 transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] uppercase text-sm font-bold tracking-wider">LOGIN</button>`;
        desktopAuth.innerHTML = loginBtn;
        mobileAuth.innerHTML = `<button onclick="document.getElementById('login-modal-btn').click()" class="text-left block px-3 py-2 text-cyan-400 border border-cyan-500 rounded text-center mb-2">LOGIN / REGISTER</button>`;
    }
}

window.logout = function() {
    localStorage.removeItem('hydra_currentUser');
    window.location.reload();
}

function setupAuthModal() {
    const modal = document.getElementById('auth-modal');
    if(!modal) return;
    
    const openBtn = document.getElementById('login-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const overlay = document.getElementById('auth-modal-overlay');
    const form = document.getElementById('auth-form');
    const errorBox = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit-btn');
    const tabs = document.querySelectorAll('.auth-tab');
    
    let isLogin = true;

    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    function openModal() {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }
    
    function closeModal() {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
        errorBox.classList.add('hidden');
        form.reset();
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const mode = e.target.dataset.tab;
            tabs.forEach(t => {
                t.classList.remove('border-cyan-500', 'text-cyan-400');
                t.classList.add('border-gray-700', 'text-gray-500');
            });
            e.target.classList.remove('border-gray-700', 'text-gray-500');
            e.target.classList.add('border-cyan-500', 'text-cyan-400');
            
            isLogin = mode === 'login';
            submitBtn.textContent = isLogin ? 'AUTHENTICATE' : 'INITIALIZE ACCOUNT';
            errorBox.classList.add('hidden');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userVal = document.getElementById('username').value.trim();
        const passVal = document.getElementById('password').value.trim();
        errorBox.classList.add('hidden');

        if (!userVal || !passVal) {
            showError("Fields cannot be empty.");
            return;
        }

        const users = JSON.parse(localStorage.getItem('hydra_users'));

        if (isLogin) {
            // Login
            const user = users.find(u => u.username.toLowerCase() === userVal.toLowerCase() && u.password === passVal);
            if (user) {
                if (user.banned) {
                    showError("Access Denied: Account Banned!");
                    return;
                }
                localStorage.setItem('hydra_currentUser', JSON.stringify(user));
                closeModal();
                if(user.role === 'admin') {
                    window.location.href = '/admin.html';
                } else {
                    window.location.href = '/dashboard.html';
                }
            } else {
                showError("Invalid credentials or account does not exist.");
            }
        } else {
            // Register
            const exists = users.find(u => u.username.toLowerCase() === userVal.toLowerCase());
            if (exists) {
                showError("Username already taken.");
                return;
            }
            const newUser = {
                username: userVal,
                password: passVal,
                role: 'user',
                xp: 0,
                rank: 'ROOKIE',
                banned: false,
                joinDate: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('hydra_users', JSON.stringify(users));
            localStorage.setItem('hydra_currentUser', JSON.stringify(newUser));
            closeModal();
            window.location.href = '/dashboard.html';
        }
    });

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
    }
}

function setupSearchModal() {
    const modal = document.getElementById('search-modal');
    if(!modal) return;
    const searchBtns = document.querySelectorAll('.search-btn');
    const closeBtn = document.getElementById('close-search-btn');
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('global-search');
    const results = document.getElementById('search-results');

    searchBtns.forEach(btn => btn.addEventListener('click', openSearch));
    closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', closeSearch);

    function openSearch() {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            document.getElementById('search-content').classList.remove('translate-y-[-20px]');
            input.focus();
        }, 10);
    }

    function closeSearch() {
        modal.classList.add('opacity-0');
        document.getElementById('search-content').classList.add('translate-y-[-20px]');
        setTimeout(() => {
            modal.classList.add('hidden');
            input.value = '';
            results.classList.add('hidden');
        }, 300);
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            results.classList.add('hidden');
            return;
        }

        const matchGames = games.filter(g => g.title.toLowerCase().includes(query) || g.category.toLowerCase().includes(query));
        
        results.innerHTML = '';
        if (matchGames.length === 0) {
            results.innerHTML = '<div class="p-4 text-gray-500 font-rajdhani text-center">No modules found.</div>';
        } else {
            matchGames.forEach(g => {
                results.innerHTML += `
                    <div class="p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors flex items-center gap-4 cursor-pointer">
                        <img src="${g.image}" class="w-12 h-12 object-cover rounded shadow-[0_0_10px_cyan]">
                        <div>
                            <h4 class="font-orbitron text-white text-sm">${g.title}</h4>
                            <p class="font-rajdhani text-gray-400 text-xs">${g.category}</p>
                        </div>
                    </div>
                `;
            });
        }
        results.classList.remove('hidden');
    });
}

function renderHomePageData() {
    // Banner
    const banners = JSON.parse(localStorage.getItem('hydra_banners')) || DEFAULT_BANNERS;
    const heroBanner = document.getElementById('hero-banner');
    if(heroBanner && banners.length > 0) {
        heroBanner.style.backgroundImage = `url('${banners[0]}')`;
    }

    // Ticker Announcements
    const ticker = document.getElementById('announcement-ticker');
    if (ticker && news.length > 0) {
        ticker.innerHTML = news.map(n => `<span class="mx-8 flex items-center gap-2"><i data-lucide="zap" class="w-4 h-4 text-cyan-500"></i> [${n.type.toUpperCase()}] ${n.title}</span>`).join('');
    }

    // Games Grid
    const gamesGrid = document.getElementById('games-grid');
    if (gamesGrid) {
        const displayGames = games.filter(g => g.featured || g.trending).slice(0, 8);
        gamesGrid.innerHTML = displayGames.map(g => `
            <div class="game-card bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
                <div class="relative h-48 overflow-hidden">
                    <img src="${g.image}" alt="${g.title}" class="w-full h-full object-cover transition-transform duration-500">
                    <div class="absolute top-3 right-3 bg-black/80 backdrop-blur border border-cyan-500/50 px-2 py-1 rounded text-cyan-400 font-rajdhani text-xs flex items-center gap-1">
                        <i data-lucide="star" class="w-3 h-3"></i> ${g.rating}
                    </div>
                </div>
                <div class="p-5">
                    <div class="text-xs text-orange-500 font-rajdhani mb-1 uppercase tracking-wider">${g.category}</div>
                    <h3 class="font-orbitron font-bold text-lg text-white mb-2 whitespace-nowrap overflow-hidden text-ellipsis">${g.title}</h3>
                    <p class="font-rajdhani text-sm text-gray-400 mb-4 line-clamp-2 h-10">${g.desc}</p>
                    <a href="${g.link}" target="_blank" class="block w-full text-center py-2 bg-gray-800 hover:bg-cyan-500 hover:text-black transition-all border border-gray-700 hover:border-cyan-400 font-orbitron text-sm font-bold rounded">
                        DOWNLOAD
                    </a>
                </div>
            </div>
        `).join('');
    }

    // News
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        newsContainer.innerHTML = news.slice(0, 3).map(n => `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl hover:border-cyan-500/50 transition-colors group cursor-pointer relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="px-2 py-1 bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 rounded text-xs font-rajdhani uppercase tracking-wider">${n.type}</span>
                        <span class="text-gray-500 text-xs font-rajdhani">${n.date}</span>
                    </div>
                    <h3 class="font-orbitron font-bold text-xl text-white mb-2 group-hover:text-cyan-400 transition-colors">${n.title}</h3>
                    <p class="font-rajdhani text-gray-400 line-clamp-2">${n.content}</p>
                </div>
            </div>
        `).join('');
    }

    // Tournaments
    const tourneyContainer = document.getElementById('tournaments-container');
    if (tourneyContainer) {
        tourneyContainer.innerHTML = tournaments.map(t => `
            <div class="bg-black border border-gray-800 p-4 rounded-lg mb-3 hover:border-purple-500/50 transition-colors pointer-cursor relative overflow-hidden group">
                <div class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-purple-500/10 to-transparent"></div>
                <h4 class="font-orbitron font-bold text-white text-md mb-1">${t.title}</h4>
                <div class="flex items-center gap-2 text-gray-400 font-rajdhani text-xs mb-3">
                    <i data-lucide="gamepad-2" class="w-3 h-3 text-cyan-400"></i> ${t.game}
                </div>
                <div class="flex justify-between items-center mt-2 border-t border-gray-800 pt-2 font-rajdhani">
                    <div class="text-cyan-400 font-bold group-hover:scale-110 transition-transform">Prize: ${t.prize}</div>
                    <div class="text-gray-500 text-xs">Slots: ${t.slots}</div>
                </div>
            </div>
        `).join('');
    }

    if(lucide) lucide.createIcons();
}
