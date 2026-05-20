(function() {
    // Increment visit count for EduCloud
    var eduCount = parseInt(localStorage.getItem('educloud_use_count') || '0', 10);
    localStorage.setItem('educloud_use_count', (eduCount + 1).toString());

    // Theme setup based on portfolio
    const currentTheme = localStorage.getItem('portfolio_theme') || 'dark';
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    }

    const contentArea = document.getElementById('sp-content');
    const roleSelect = document.getElementById('role-select');

    // Data for different dashboards
    const dashboards = {
        admin: `
            <div class="sp-header-wrap">
                <h1>Admin Dashboard</h1>
                <p>Overview of school performance and daily metrics.</p>
            </div>
            
            <div class="sp-stats-grid">
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-blue-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Total Students</h3>
                        <p>1,245</p>
                    </div>
                </div>
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-green-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Teachers</h3>
                        <p>84</p>
                    </div>
                </div>
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-orange-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Fee Collection</h3>
                        <p>$45,200</p>
                    </div>
                </div>
            </div>

            <div class="sp-grid-2">
                <div class="sp-panel">
                    <div class="sp-panel-header">
                        <h3>Recent Admissions</h3>
                    </div>
                    <div class="sp-list">
                        <div class="sp-list-item">
                            <div class="sp-avatar" style="width: 40px; height: 40px;">S</div>
                            <div class="sp-item-info" style="flex:1;">
                                <div class="sp-item-title">Sarah Jenkins</div>
                                <div class="sp-item-desc">Grade 10 • Section A</div>
                            </div>
                            <span class="sp-badge-status bg-green-dim">Approved</span>
                        </div>
                        <div class="sp-list-item">
                            <div class="sp-avatar" style="width: 40px; height: 40px; background:var(--sp-orange)">M</div>
                            <div class="sp-item-info" style="flex:1;">
                                <div class="sp-item-title">Michael Chen</div>
                                <div class="sp-item-desc">Grade 8 • Section C</div>
                            </div>
                            <span class="sp-badge-status bg-orange-dim">Pending</span>
                        </div>
                    </div>
                </div>
                <div class="sp-panel">
                    <div class="sp-panel-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div class="sp-list">
                        <button style="width:100%; padding: 0.75rem; background: var(--sp-accent); color: white; border-radius: 8px; margin-bottom: 0.5rem;">Create Notice</button>
                        <button style="width:100%; padding: 0.75rem; background: var(--sp-bg-3); border: 1px solid var(--sp-border); color: var(--sp-fg); border-radius: 8px;">View Reports</button>
                    </div>
                </div>
            </div>
        `,
        teacher: `
            <div class="sp-header-wrap">
                <h1>Teacher Dashboard</h1>
                <p>Manage your classes, attendance, and assignments.</p>
            </div>
            
            <div class="sp-stats-grid">
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-blue-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Attendance Today</h3>
                        <p>94%</p>
                    </div>
                </div>
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-orange-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Pending Grading</h3>
                        <p>28</p>
                    </div>
                </div>
            </div>

            <div class="sp-grid-2">
                <div class="sp-panel">
                    <div class="sp-panel-header">
                        <h3>Today's Classes</h3>
                    </div>
                    <div class="sp-list">
                        <div class="sp-list-item">
                            <div class="sp-item-info" style="flex:1;">
                                <div class="sp-item-title">Mathematics - Grade 10 A</div>
                                <div class="sp-item-desc">09:00 AM - 09:45 AM</div>
                            </div>
                            <span class="sp-badge-status bg-green-dim">Completed</span>
                        </div>
                        <div class="sp-list-item">
                            <div class="sp-item-info" style="flex:1;">
                                <div class="sp-item-title">Physics - Grade 11 B</div>
                                <div class="sp-item-desc">10:00 AM - 10:45 AM</div>
                            </div>
                            <span class="sp-badge-status bg-blue-dim">Ongoing</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        parent: `
            <div class="sp-header-wrap">
                <h1>Parent Dashboard</h1>
                <p>Monitor your child's academic progress and activities.</p>
            </div>
            
            <div class="sp-stats-grid">
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-blue-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Attendance</h3>
                        <p>98%</p>
                    </div>
                </div>
                <div class="sp-stat-card">
                    <div class="sp-stat-icon bg-orange-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <div class="sp-stat-info">
                        <h3>Next Fee Due</h3>
                        <p>June 5</p>
                    </div>
                </div>
            </div>

            <div class="sp-grid-2">
                <div class="sp-panel">
                    <div class="sp-panel-header">
                        <h3>Recent Homework</h3>
                    </div>
                    <div class="sp-list">
                        <div class="sp-list-item">
                            <div class="sp-item-info" style="flex:1;">
                                <div class="sp-item-title">Algebra Worksheet</div>
                                <div class="sp-item-desc">Math • Due Tomorrow</div>
                            </div>
                            <span class="sp-badge-status bg-orange-dim">Pending</span>
                        </div>
                        <div class="sp-list-item">
                            <div class="sp-item-info" style="flex:1;">
                                <div class="sp-item-title">Science Project</div>
                                <div class="sp-item-desc">Physics • Submitted</div>
                            </div>
                            <span class="sp-badge-status bg-green-dim">Done</span>
                        </div>
                    </div>
                </div>
                <div class="sp-panel">
                    <div class="sp-panel-header">
                        <h3>School Notices</h3>
                    </div>
                    <div class="sp-list">
                        <div class="sp-list-item">
                            <div class="sp-item-info">
                                <div class="sp-item-title">Annual Sports Day</div>
                                <div class="sp-item-desc">May 25, 2026 • 09:00 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    function renderDashboard() {
        const role = roleSelect.value;
        contentArea.innerHTML = dashboards[role];
    }

    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginBtn = document.getElementById('login-btn');
    const loginRoleSelect = document.getElementById('login-role');

    // Login Handle
    loginBtn.addEventListener('click', function() {
        const selectedRole = loginRoleSelect.value;
        roleSelect.value = selectedRole;
        loginScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        renderDashboard();
    });

    // Initialize
    roleSelect.addEventListener('change', renderDashboard);
    // Don't render dashboard initially since we're on login screen
})();
