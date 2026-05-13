document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    const currentUser = JSON.parse(localStorage.getItem('hydra_currentUser'));
    if (!currentUser) {
        window.location.href = '/index.html';
        return;
    }

    if (currentUser.banned) {
        alert("Your account is banned.");
        localStorage.removeItem('hydra_currentUser');
        window.location.href = '/index.html';
        return;
    }

    // Populate user info
    document.getElementById('side-username').textContent = currentUser.username;
    document.getElementById('side-rank').textContent = currentUser.rank || 'ROOKIE';
    
    document.getElementById('welcome-text').textContent = `WELCOME BACK, ${currentUser.username}`;
    document.getElementById('card-username').textContent = currentUser.username;
    document.getElementById('card-rank').textContent = currentUser.rank || 'ROOKIE';
    document.getElementById('card-xp').textContent = currentUser.xp || 0;
    
    function setAvatars(urlUrl) {
        document.getElementById('profile-avatar').src = urlUrl;
        const sideIcon = document.getElementById('side-user-icon');
        if (sideIcon) sideIcon.style.display = 'none';
        
        const sideContainer = document.getElementById('side-avatar-container');
        if (sideContainer) {
            let existingImg = sideContainer.querySelector('img');
            if (existingImg) {
                existingImg.src = urlUrl;
            } else {
                sideContainer.innerHTML += `<img src="${urlUrl}" class="w-full h-full object-cover">`;
            }
        }
    }

    if (currentUser.avatar) {
        setAvatars(currentUser.avatar);
    } else {
        document.getElementById('profile-avatar').src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8ABC&color=fff`;
    }

    // Avatar Upload Logic
    const avatarBtn = document.getElementById('avatar-upload-btn');
    const avatarInput = document.getElementById('avatar-upload');

    if (avatarBtn && avatarInput) {
        avatarBtn.addEventListener('click', () => avatarInput.click());

        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 256;
                    const MAX_HEIGHT = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                    // Save to user object
                    currentUser.avatar = dataUrl;
                    localStorage.setItem('hydra_currentUser', JSON.stringify(currentUser));

                    const users = JSON.parse(localStorage.getItem('hydra_users')) || [];
                    const userIndex = users.findIndex(u => u.username === currentUser.username);
                    if (userIndex !== -1) {
                        users[userIndex].avatar = dataUrl;
                        localStorage.setItem('hydra_users', JSON.stringify(users));
                    }

                    setAvatars(dataUrl);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Calculate XP Bar purely visually
    const xpNum = parseInt(currentUser.xp) || 0;
    const percentage = Math.min((xpNum % 1000) / 10, 100);
    document.getElementById('xp-bar-fill').style.width = `${percentage}%`;

    // Render some games in dashboard
    const games = JSON.parse(localStorage.getItem('hydra_games')) || [];
    const dashGamesContainer = document.getElementById('dashboard-games');
    
    if (dashGamesContainer) {
        // Just show first 6 games as "Library"
        const libraryGames = games.slice(0, 6);
        dashGamesContainer.innerHTML = libraryGames.map(g => `
            <div class="bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all group relative">
                <div class="h-32 overflow-hidden">
                    <img src="${g.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-4 relative">
                    <h3 class="font-orbitron font-bold text-lg text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap">${g.title}</h3>
                    <p class="font-rajdhani text-gray-500 text-sm mb-4">${g.category}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-rajdhani text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded bg-cyan-900/20">v1.0.4</span>
                        <a href="${g.link}" target="_blank" class="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black hover:bg-white transition-colors">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if(mobileSidebar.classList.contains('translate-x-full')) {
                mobileSidebar.classList.remove('translate-x-full');
            } else {
                mobileSidebar.classList.add('translate-x-full');
            }
        });
    }
});

window.logout = function() {
    localStorage.removeItem('hydra_currentUser');
    window.location.href = '/index.html';
}
