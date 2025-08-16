// AuditPulse - Main Application Logic
// Single Page Application with State Management

// Global Application State
window.AuditPulse = {
    // Application State
    state: {
        // Navigation & UI
        currentView: 'dashboard',
        step: 0,
        language: 'en',
        isLoading: false,
        
        // Audit Configuration
        auditType: null,
        currentAudit: null,
        
        // Company & Audit Information
        companyInfo: {
            name: '',
            address: '',
            industry: '',
            fiscalYearEnd: '',
            auditPeriod: {
                start: '',
                end: ''
            },
            previousAuditor: '',
            managementLetter: null
        },
        
        // Financial Data
        trialBalance: [],
        accountMappings: {},
        journalEntries: [],
        adjustments: [],
        
        // Audit Process
        tasks: [],
        risks: [],
        findings: [],
        workingPapers: [],
        evidence: [],
        
        // Reports & Output
        reports: {
            auditPlan: null,
            managementLetter: null,
            auditorReport: null,
            financialStatements: null
        },
        
        // Team & Workflow
        team: [],
        approvals: [],
        comments: [],
        
        // API & Integration
        integrations: {
            erp: null,
            accounting: null,
            compliance: null
        }
    },
    
    // Modules registry
    modules: {
        financial_audit: null,
        compliance_audit: null,
        operational_audit: null,
        internal_audit: null,
        financial_control_audit: null
    },
    
    // Components registry
    components: {},
    
    // Utilities
    utils: {},
    
    // Translation system
    i18n: {
        currentLanguage: 'en',
        translations: {},
        
        // Load translation file
        async loadTranslations(language) {
            try {
                const response = await fetch(`i18n/${language}.json`);
                const translations = await response.json();
                this.translations[language] = translations;
                this.currentLanguage = language;
                return translations;
            } catch (error) {
                console.error(`Failed to load translations for ${language}:`, error);
                return {};
            }
        },
        
        // Get translated text
        t(key, params = {}) {
            const translation = this.translations[this.currentLanguage]?.[key] || key;
            return this.interpolate(translation, params);
        },
        
        // Interpolate parameters in translation strings
        interpolate(text, params) {
            return text.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
        }
    }
};

// Application Initialization
class AuditPulseApp {
    constructor() {
        this.state = window.AuditPulse.state;
        this.components = window.AuditPulse.components;
        this.utils = window.AuditPulse.utils;
        this.i18n = window.AuditPulse.i18n;
    }
    
    // Initialize the application
    async init() {
        console.log('Initializing AuditPulse...');
        
        try {
            // Load translations
            await this.loadTranslations();
            
            // Load modules
            await this.loadModules();
            
            // Load components
            await this.loadComponents();
            
            // Load utilities
            await this.loadUtilities();
            
            // Initialize event listeners
            this.initializeEventListeners();
            
            // Initialize icons
            this.initializeIcons();
            
            // Render initial view
            await this.renderApp();
            
            // Hide loading screen
            this.hideLoading();
            
            console.log('AuditPulse initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AuditPulse:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }
    
    // Load translation files
    async loadTranslations() {
        await Promise.all([
            this.i18n.loadTranslations('en'),
            this.i18n.loadTranslations('ar')
        ]);
    }
    
    // Load audit modules
    async loadModules() {
        const moduleNames = ['financial_audit', 'compliance_audit', 'operational_audit', 'internal_audit', 'financial_control_audit'];
        
        for (const moduleName of moduleNames) {
            try {
                // Load module configuration
                const workflowResponse = await fetch(`modules/${moduleName}/workflow.json`);
                const workflow = await workflowResponse.json();
                
                // Create module object
                window.AuditPulse.modules[moduleName] = {
                    name: moduleName,
                    workflow: workflow,
                    components: null,
                    prompts: null
                };
                
            } catch (error) {
                console.warn(`Failed to load module ${moduleName}:`, error);
            }
        }
    }
    
    // Load UI components
    async loadComponents() {
        // Components will be loaded dynamically
        console.log('Components will be loaded dynamically');
    }
    
    // Load utility functions
    async loadUtilities() {
        // Utilities will be loaded dynamically
        console.log('Utilities will be loaded dynamically');
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Language toggle
        const langBtn = document.getElementById('lang-btn');
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveCurrentState();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                }
            }
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.setState(e.state);
                this.renderApp();
            }
        });
    }
    
    // Initialize Lucide icons
    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Main render function
    async renderApp() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        this.state.isLoading = true;
        
        try {
            let content = '';
            
            switch (this.state.currentView) {
                case 'dashboard':
                    content = await this.renderDashboard();
                    break;
                case 'workflow':
                    content = await this.renderWorkflow();
                    break;
                case 'reports':
                    content = await this.renderReports();
                    break;
                default:
                    content = await this.renderDashboard();
            }
            
            appContainer.innerHTML = content;
            
            // Re-initialize icons after DOM update
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 100);
            
            // Show language toggle
            document.getElementById('language-toggle').classList.remove('hidden');
            
        } catch (error) {
            console.error('Error rendering app:', error);
            appContainer.innerHTML = this.renderError('Failed to render application content');
        }
        
        this.state.isLoading = false;
    }
    
    // Render dashboard
    async renderDashboard() {
        return `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b border-gray-200">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 flex items-center">
                                    <i data-lucide="audit" class="h-8 w-8 text-primary-600"></i>
                                    <span class="ml-2 text-xl font-bold text-gray-900">AuditPulse</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button class="btn btn-primary" onclick="app.startNewAudit()">
                                    <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                                    ${this.i18n.t('new_audit', {default: 'New Audit'})}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <!-- Main Content -->
                <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <!-- Welcome Section -->
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">${this.i18n.t('welcome_to_auditpulse', {default: 'Welcome to AuditPulse'})}</h1>
                        <p class="text-gray-600">${this.i18n.t('comprehensive_audit_solution', {default: 'Comprehensive audit management solution with AI-powered insights'})}</p>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="card">
                            <div class="card-body">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <i data-lucide="file-text" class="h-8 w-8 text-primary-600"></i>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-500">${this.i18n.t('active_audits', {default: 'Active Audits'})}</p>
                                        <p class="text-2xl font-semibold text-gray-900">${this.getActiveAuditsCount()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-body">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <i data-lucide="users" class="h-8 w-8 text-accent-500"></i>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-500">${this.i18n.t('team_members', {default: 'Team Members'})}</p>
                                        <p class="text-2xl font-semibold text-gray-900">${this.state.team.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-body">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <i data-lucide="alert-triangle" class="h-8 w-8 text-yellow-500"></i>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-500">${this.i18n.t('high_risk_areas', {default: 'High Risk Areas'})}</p>
                                        <p class="text-2xl font-semibold text-gray-900">${this.getHighRiskCount()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-body">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <i data-lucide="check-circle" class="h-8 w-8 text-green-500"></i>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-500">${this.i18n.t('completed_tasks', {default: 'Completed Tasks'})}</p>
                                        <p class="text-2xl font-semibold text-gray-900">${this.getCompletedTasksCount()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Audit Modules -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Available Audit Types -->
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-lg font-semibold text-gray-900">${this.i18n.t('audit_types', {default: 'Available Audit Types'})}</h2>
                            </div>
                            <div class="card-body">
                                <div class="space-y-4">
                                    ${this.renderAuditTypeCards()}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Recent Activity -->
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-lg font-semibold text-gray-900">${this.i18n.t('recent_activity', {default: 'Recent Activity'})}</h2>
                            </div>
                            <div class="card-body">
                                <div class="space-y-4">
                                    ${this.renderRecentActivity()}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }
    
    // Render audit type cards
    renderAuditTypeCards() {
        const auditTypes = [
            { id: 'financial_audit', name: 'Financial Audit', icon: 'calculator', description: 'Comprehensive financial statement audits' },
            { id: 'compliance_audit', name: 'Compliance Audit', icon: 'shield-check', description: 'Regulatory compliance verification' },
            { id: 'operational_audit', name: 'Operational Audit', icon: 'settings', description: 'Process efficiency and effectiveness' },
            { id: 'internal_audit', name: 'Internal Audit', icon: 'search', description: 'Internal controls and governance' },
            { id: 'financial_control_audit', name: 'Financial Control Audit', icon: 'lock', description: 'Financial controls and procedures' }
        ];
        
        return auditTypes.map(type => `
            <div class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all"
                 onclick="app.selectAuditType('${type.id}')">
                <div class="flex-shrink-0">
                    <i data-lucide="${type.icon}" class="h-6 w-6 text-primary-600"></i>
                </div>
                <div class="ml-4 flex-1">
                    <h3 class="text-sm font-medium text-gray-900">${type.name}</h3>
                    <p class="text-sm text-gray-500">${type.description}</p>
                </div>
                <div class="flex-shrink-0">
                    <i data-lucide="chevron-right" class="h-4 w-4 text-gray-400"></i>
                </div>
            </div>
        `).join('');
    }
    
    // Render recent activity
    renderRecentActivity() {
        if (this.state.tasks.length === 0) {
            return `
                <div class="text-center py-8">
                    <i data-lucide="inbox" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                    <p class="text-gray-500">${this.i18n.t('no_recent_activity', {default: 'No recent activity'})}</p>
                </div>
            `;
        }
        
        return this.state.tasks.slice(0, 5).map(task => `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <div class="h-2 w-2 rounded-full ${task.status === 'completed' ? 'bg-green-400' : task.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'}"></div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900 truncate">${task.title}</p>
                    <p class="text-xs text-gray-500">${this.formatDate(task.updatedAt)}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Render error state
    renderError(message) {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center">
                    <i data-lucide="alert-circle" class="h-12 w-12 text-red-500 mx-auto mb-4"></i>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                    <p class="text-gray-600 mb-4">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                        Reload Page
                    </button>
                </div>
            </div>
        `;
    }
    
    // Utility functions
    setState(newState) {
        Object.assign(this.state, newState);
    }
    
    getActiveAuditsCount() {
        return this.state.currentAudit ? 1 : 0;
    }
    
    getHighRiskCount() {
        return this.state.risks.filter(risk => risk.level === 'high').length;
    }
    
    getCompletedTasksCount() {
        return this.state.tasks.filter(task => task.status === 'completed').length;
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }
    
    // Navigation functions
    startNewAudit() {
        this.state.currentView = 'workflow';
        this.state.step = 0;
        this.renderApp();
    }
    
    selectAuditType(auditType) {
        this.state.auditType = auditType;
        this.state.currentAudit = window.AuditPulse.modules[auditType];
        this.startNewAudit();
    }
    
    // Language functions
    async toggleLanguage() {
        const newLanguage = this.state.language === 'en' ? 'ar' : 'en';
        await this.setLanguage(newLanguage);
    }
    
    async setLanguage(language) {
        this.state.language = language;
        this.i18n.currentLanguage = language;
        
        // Update document direction for RTL languages
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        
        // Update language button
        const langBtn = document.getElementById('current-lang');
        if (langBtn) {
            langBtn.textContent = language.toUpperCase();
        }
        
        // Re-render current view
        await this.renderApp();
    }
    
    // State management
    saveCurrentState() {
        localStorage.setItem('auditpulse_state', JSON.stringify(this.state));
        this.showNotification('State saved successfully', 'success');
    }
    
    loadSavedState() {
        const savedState = localStorage.getItem('auditpulse_state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                this.setState(parsedState);
                return true;
            } catch (error) {
                console.error('Failed to parse saved state:', error);
                return false;
            }
        }
        return false;
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        const notificationsContainer = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `p-4 rounded-lg shadow-lg ${this.getNotificationClasses(type)} animate-slide-up`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="${this.getNotificationIcon(type)}" class="w-5 h-5 mr-3"></i>
                <span>${message}</span>
                <button class="ml-auto pl-3" onclick="this.parentElement.parentElement.remove()">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        notificationsContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    getNotificationClasses(type) {
        switch (type) {
            case 'success': return 'bg-green-500 text-white';
            case 'error': return 'bg-red-500 text-white';
            case 'warning': return 'bg-yellow-500 text-white';
            default: return 'bg-blue-500 text-white';
        }
    }
    
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'alert-triangle';
            default: return 'info';
        }
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    // Loading states
    hideLoading() {
        const loadingElement = document.getElementById('loading');
        const appElement = document.getElementById('app');
        
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
        if (appElement) {
            appElement.classList.remove('hidden');
        }
    }
    
    // Export functionality
    exportData() {
        // Implementation will be added in reports component
        this.showNotification('Export functionality will be implemented', 'info');
    }
    
    // Placeholder for workflow rendering
    async renderWorkflow() {
        return `
            <div class="min-h-screen bg-gray-50 p-6">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-2xl font-bold text-gray-900 mb-6">Audit Workflow - Step ${this.state.step + 1}</h1>
                    <div class="card">
                        <div class="card-body">
                            <p>Workflow implementation coming soon...</p>
                            <button class="btn btn-secondary mt-4" onclick="app.setState({currentView: 'dashboard'}); app.renderApp();">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Placeholder for reports rendering
    async renderReports() {
        return `
            <div class="min-h-screen bg-gray-50 p-6">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
                    <div class="card">
                        <div class="card-body">
                            <p>Reports implementation coming soon...</p>
                            <button class="btn btn-secondary mt-4" onclick="app.setState({currentView: 'dashboard'}); app.renderApp();">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new AuditPulseApp();
    await window.app.init();
});