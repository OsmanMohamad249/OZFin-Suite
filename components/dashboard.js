// AuditPulse Dashboard Components
// Main dashboard with KPIs, charts, and analytics

class DashboardComponents {
    constructor() {
        this.charts = {};
        this.refreshInterval = null;
        this.i18n = window.AuditPulse?.i18n || { t: (key) => key };
    }
    
    // Main dashboard render method
    renderDashboard() {
        const state = window.app?.state || {};
        
        return `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                ${this.renderHeader()}
                
                <!-- Main Content -->
                <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <!-- Welcome Section -->
                    ${this.renderWelcomeSection()}
                    
                    <!-- Quick Stats -->
                    ${this.renderQuickStats()}
                    
                    <!-- Charts and Analytics -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        ${this.renderAuditProgress()}
                        ${this.renderRiskAnalytics()}
                    </div>
                    
                    <!-- Audit Modules and Recent Activity -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        ${this.renderAuditModules()}
                        ${this.renderRecentActivity()}
                    </div>
                </main>
            </div>
        `;
    }
    
    // Render header section
    renderHeader() {
        return `
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center">
                                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                    <i data-lucide="audit" class="h-5 w-5 text-white"></i>
                                </div>
                                <span class="ml-3 text-xl font-bold text-gray-900">AuditPulse</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button class="btn btn-outline" onclick="dashboard.exportDashboard()">
                                <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                                Export
                            </button>
                            <button class="btn btn-primary" onclick="app.startNewAudit()">
                                <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                                ${this.i18n.t('new_audit')}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
    
    // Render welcome section
    renderWelcomeSection() {
        const currentTime = new Date();
        const greeting = this.getTimeBasedGreeting();
        
        return `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    ${greeting}, ${this.i18n.t('welcome_to_auditpulse')}
                </h1>
                <p class="text-gray-600">
                    ${this.i18n.t('comprehensive_audit_solution')} - ${currentTime.toLocaleDateString()}
                </p>
            </div>
        `;
    }
    
    // Render quick stats cards
    renderQuickStats() {
        const stats = this.calculateStats();
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Active Audits -->
                <div class="card hover:shadow-lg transition-shadow animate-fade-in">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="file-text" class="h-6 w-6 text-primary-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">${this.i18n.t('active_audits')}</p>
                                <p class="text-2xl font-semibold text-gray-900">${stats.activeAudits}</p>
                                <p class="text-xs text-green-600 flex items-center">
                                    <i data-lucide="trending-up" class="w-3 h-3 mr-1"></i>
                                    +${stats.auditGrowth}% from last month
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Team Members -->
                <div class="card hover:shadow-lg transition-shadow animate-fade-in" style="animation-delay: 0.1s">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="users" class="h-6 w-6 text-accent-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">${this.i18n.t('team_members')}</p>
                                <p class="text-2xl font-semibold text-gray-900">${stats.teamMembers}</p>
                                <p class="text-xs text-gray-600">
                                    ${stats.activeTeamMembers} active this week
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- High Risk Areas -->
                <div class="card hover:shadow-lg transition-shadow animate-fade-in" style="animation-delay: 0.2s">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="alert-triangle" class="h-6 w-6 text-yellow-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">${this.i18n.t('high_risk_areas')}</p>
                                <p class="text-2xl font-semibold text-gray-900">${stats.highRiskAreas}</p>
                                <p class="text-xs text-yellow-600">
                                    Requires immediate attention
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Completed Tasks -->
                <div class="card hover:shadow-lg transition-shadow animate-fade-in" style="animation-delay: 0.3s">
                    <div class="card-body">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="check-circle" class="h-6 w-6 text-green-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">${this.i18n.t('completed_tasks')}</p>
                                <p class="text-2xl font-semibold text-gray-900">${stats.completedTasks}</p>
                                <p class="text-xs text-green-600">
                                    ${stats.completionRate}% completion rate
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render audit progress chart
    renderAuditProgress() {
        return `
            <div class="card">
                <div class="card-header">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">Audit Progress</h3>
                        <div class="flex space-x-2">
                            <button class="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">Weekly</button>
                            <button class="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">Monthly</button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="auditProgressChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render risk analytics
    renderRiskAnalytics() {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="text-lg font-semibold text-gray-900">Risk Distribution</h3>
                </div>
                <div class="card-body">
                    <div class="chart-container">
                        <canvas id="riskDistributionChart"></canvas>
                    </div>
                    
                    <div class="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-lg font-semibold text-red-600">15</div>
                            <div class="text-xs text-gray-600">High Risk</div>
                        </div>
                        <div>
                            <div class="text-lg font-semibold text-yellow-600">28</div>
                            <div class="text-xs text-gray-600">Medium Risk</div>
                        </div>
                        <div>
                            <div class="text-lg font-semibold text-green-600">42</div>
                            <div class="text-xs text-gray-600">Low Risk</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render audit modules section
    renderAuditModules() {
        const auditTypes = [
            { 
                id: 'financial_audit', 
                name: 'Financial Audit', 
                icon: 'calculator', 
                description: 'Comprehensive financial statement audits',
                status: 'active',
                progress: 75
            },
            { 
                id: 'compliance_audit', 
                name: 'Compliance Audit', 
                icon: 'shield-check', 
                description: 'Regulatory compliance verification',
                status: 'pending',
                progress: 0
            },
            { 
                id: 'operational_audit', 
                name: 'Operational Audit', 
                icon: 'settings', 
                description: 'Process efficiency and effectiveness',
                status: 'completed',
                progress: 100
            },
            { 
                id: 'internal_audit', 
                name: 'Internal Audit', 
                icon: 'search', 
                description: 'Internal controls and governance',
                status: 'active',
                progress: 45
            },
            { 
                id: 'financial_control_audit', 
                name: 'Financial Control Audit', 
                icon: 'lock', 
                description: 'Financial controls and procedures',
                status: 'pending',
                progress: 0
            }
        ];
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="text-lg font-semibold text-gray-900">${this.i18n.t('audit_types')}</h3>
                </div>
                <div class="card-body">
                    <div class="space-y-4">
                        ${auditTypes.map(type => `
                            <div class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all"
                                 onclick="app.selectAuditType('${type.id}')">
                                <div class="flex-shrink-0">
                                    <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <i data-lucide="${type.icon}" class="h-5 w-5 text-primary-600"></i>
                                    </div>
                                </div>
                                <div class="ml-4 flex-1">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-sm font-medium text-gray-900">${type.name}</h4>
                                        <span class="badge ${this.getStatusBadgeClass(type.status)}">${type.status}</span>
                                    </div>
                                    <p class="text-sm text-gray-500 mt-1">${type.description}</p>
                                    ${type.progress > 0 ? `
                                        <div class="mt-2">
                                            <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>${type.progress}%</span>
                                            </div>
                                            <div class="progress-bar h-1">
                                                <div class="progress-fill h-1" style="width: ${type.progress}%"></div>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="flex-shrink-0 ml-4">
                                    <i data-lucide="chevron-right" class="h-4 w-4 text-gray-400"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render recent activity
    renderRecentActivity() {
        const activities = this.getRecentActivities();
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">${this.i18n.t('recent_activity')}</h3>
                        <button class="text-sm text-primary-600 hover:text-primary-700" onclick="dashboard.viewAllActivity()">
                            View All
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    ${activities.length > 0 ? `
                        <div class="space-y-4">
                            ${activities.map(activity => `
                                <div class="flex items-center space-x-3">
                                    <div class="flex-shrink-0">
                                        <div class="w-2 h-2 rounded-full ${this.getActivityStatusColor(activity.type)}"></div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm text-gray-900 truncate">${activity.title}</p>
                                        <p class="text-xs text-gray-500">${activity.description}</p>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <p class="text-xs text-gray-500">${this.formatRelativeTime(activity.timestamp)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-8">
                            <i data-lucide="inbox" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                            <p class="text-gray-500">${this.i18n.t('no_recent_activity')}</p>
                            <button class="btn btn-primary mt-4" onclick="app.startNewAudit()">
                                Start Your First Audit
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
    
    // Initialize charts after DOM is loaded
    initializeCharts() {
        // Initialize audit progress chart
        this.initializeAuditProgressChart();
        
        // Initialize risk distribution chart
        this.initializeRiskDistributionChart();
    }
    
    // Initialize audit progress chart
    initializeAuditProgressChart() {
        const ctx = document.getElementById('auditProgressChart');
        if (!ctx || typeof Chart === 'undefined') return;
        
        this.charts.auditProgress = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Completed Audits',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Initialize risk distribution chart
    initializeRiskDistributionChart() {
        const ctx = document.getElementById('riskDistributionChart');
        if (!ctx || typeof Chart === 'undefined') return;
        
        this.charts.riskDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['High Risk', 'Medium Risk', 'Low Risk'],
                datasets: [{
                    data: [15, 28, 42],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(34, 197, 94, 0.8)'
                    ],
                    borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(245, 158, 11)',
                        'rgb(34, 197, 94)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Helper methods
    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return this.i18n.t('good_morning') || 'Good Morning';
        if (hour < 17) return this.i18n.t('good_afternoon') || 'Good Afternoon';
        return this.i18n.t('good_evening') || 'Good Evening';
    }
    
    calculateStats() {
        const state = window.app?.state || {};
        return {
            activeAudits: state.currentAudit ? 1 : 0,
            auditGrowth: 12,
            teamMembers: state.team?.length || 0,
            activeTeamMembers: Math.ceil((state.team?.length || 0) * 0.8),
            highRiskAreas: state.risks?.filter(r => r.level === 'high').length || 3,
            completedTasks: state.tasks?.filter(t => t.status === 'completed').length || 0,
            completionRate: state.tasks?.length > 0 ? 
                Math.round((state.tasks.filter(t => t.status === 'completed').length / state.tasks.length) * 100) : 0
        };
    }
    
    getStatusBadgeClass(status) {
        switch (status) {
            case 'active': return 'badge-info';
            case 'completed': return 'badge-success';
            case 'pending': return 'badge-warning';
            default: return 'badge-info';
        }
    }
    
    getActivityStatusColor(type) {
        switch (type) {
            case 'success': return 'bg-green-400';
            case 'warning': return 'bg-yellow-400';
            case 'error': return 'bg-red-400';
            default: return 'bg-blue-400';
        }
    }
    
    getRecentActivities() {
        // Mock activities - in real implementation, this would come from state/API
        return [
            {
                title: 'Financial audit completed',
                description: 'ABC Corporation Q4 2024 audit finalized',
                timestamp: Date.now() - 3600000, // 1 hour ago
                type: 'success'
            },
            {
                title: 'High risk area identified',
                description: 'Revenue recognition requires attention',
                timestamp: Date.now() - 7200000, // 2 hours ago
                type: 'warning'
            },
            {
                title: 'New team member added',
                description: 'Sarah Johnson joined the audit team',
                timestamp: Date.now() - 10800000, // 3 hours ago
                type: 'info'
            }
        ];
    }
    
    formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    
    // Action methods
    exportDashboard() {
        console.log('Exporting dashboard data...');
        // Implementation for dashboard export
    }
    
    viewAllActivity() {
        console.log('Viewing all activity...');
        // Implementation for viewing all activities
    }
    
    // Cleanup method
    destroy() {
        // Destroy all charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        
        // Clear refresh interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Export to global scope
window.dashboard = new DashboardComponents();