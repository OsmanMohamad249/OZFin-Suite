// AuditPulse Workflow Components
// Handles the 9-step audit workflow UI and logic

class WorkflowStepsComponents {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            { id: 'activity_selection', name: 'Activity Selection', component: this.renderActivitySelection },
            { id: 'company_info', name: 'Company Information', component: this.renderCompanyInfo },
            { id: 'data_upload', name: 'Data Upload', component: this.renderDataUpload },
            { id: 'account_mapping', name: 'Account Mapping', component: this.renderAccountMapping },
            { id: 'risk_analysis', name: 'Risk Analysis', component: this.renderRiskAnalysis },
            { id: 'audit_plan', name: 'Audit Planning', component: this.renderAuditPlanning },
            { id: 'task_management', name: 'Task Management', component: this.renderTaskManagement },
            { id: 'reconciliation', name: 'Reconciliation', component: this.renderReconciliation },
            { id: 'reports', name: 'Reports', component: this.renderReports }
        ];
        this.i18n = window.AuditPulse?.i18n || { t: (key) => key };
    }
    
    // Main workflow renderer
    renderWorkflow(step = 0) {
        this.currentStep = step;
        const currentStepData = this.steps[step];
        
        if (!currentStepData) {
            return this.renderError('Invalid step');
        }
        
        const progressBar = this.renderProgressBar(step);
        const stepContent = currentStepData.component.call(this);
        
        return `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b border-gray-200">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <button onclick="app.setState({currentView: 'dashboard'}); app.renderApp();" 
                                        class="flex items-center text-primary-600 hover:text-primary-700">
                                    <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
                                    <span class="font-medium">Back to Dashboard</span>
                                </button>
                            </div>
                            <div class="text-center">
                                <h1 class="text-xl font-semibold text-gray-900">${currentStepData.name}</h1>
                                <p class="text-sm text-gray-500">Step ${step + 1} of ${this.steps.length}</p>
                            </div>
                            <div class="w-32"></div> <!-- Spacer for centering -->
                        </div>
                    </div>
                </header>
                
                <!-- Progress Bar -->
                ${progressBar}
                
                <!-- Step Content -->
                <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    ${stepContent}
                </main>
            </div>
        `;
    }
    
    // Render progress bar
    renderProgressBar(currentStep) {
        const progress = ((currentStep + 1) / this.steps.length) * 100;
        
        return `
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="py-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">Progress</span>
                            <span class="text-sm font-medium text-gray-700">${Math.round(progress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill transition-all duration-300" style="width: ${progress}%"></div>
                        </div>
                        
                        <!-- Step indicators -->
                        <div class="flex justify-between mt-4">
                            ${this.steps.map((step, index) => `
                                <div class="flex flex-col items-center ${index <= currentStep ? 'text-primary-600' : 'text-gray-400'}">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                                        index < currentStep ? 'bg-primary-600 text-white' : 
                                        index === currentStep ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600' :
                                        'bg-gray-200'
                                    }">
                                        ${index < currentStep ? '<i data-lucide="check" class="w-4 h-4"></i>' : index + 1}
                                    </div>
                                    <span class="text-xs font-medium text-center max-w-16">${step.name.replace(' ', '<br>')}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Step 1: Activity Selection
    renderActivitySelection() {
        const auditType = window.app?.state?.auditType || 'financial_audit';
        const auditModule = window.AuditPulse?.modules?.[auditType];
        
        return `
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Audit Configuration</h2>
                    <p class="text-gray-600">Configure your ${auditModule?.workflow?.name || 'audit'} parameters and scope</p>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Selected Audit Type</h3>
                    </div>
                    <div class="card-body">
                        <div class="flex items-center p-4 bg-primary-50 rounded-lg">
                            <i data-lucide="check-circle" class="w-8 h-8 text-primary-600 mr-4"></i>
                            <div>
                                <h4 class="font-semibold text-primary-900">${auditModule?.workflow?.name || 'Financial Audit'}</h4>
                                <p class="text-primary-700">${auditModule?.workflow?.description || 'Comprehensive financial statement audit'}</p>
                            </div>
                        </div>
                        
                        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="form-label">Audit Scope</label>
                                <select class="form-control" id="auditScope">
                                    <option value="full">Full Scope Audit</option>
                                    <option value="limited">Limited Scope</option>
                                    <option value="focused">Focused Review</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="form-label">Priority Level</label>
                                <select class="form-control" id="priorityLevel">
                                    <option value="high">High Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <label class="form-label">Audit Objectives</label>
                            <textarea class="form-control" rows="4" id="auditObjectives" 
                                      placeholder="Enter specific audit objectives and goals..."></textarea>
                        </div>
                    </div>
                </div>
                
                ${this.renderNavigationButtons(0)}
            </div>
        `;
    }
    
    // Step 2: Company Information
    renderCompanyInfo() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                    <p class="text-gray-600">Provide essential information about the organization being audited</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Basic Information</h3>
                        </div>
                        <div class="card-body space-y-4">
                            <div>
                                <label class="form-label">Company Name *</label>
                                <input type="text" class="form-control" id="companyName" required>
                            </div>
                            <div>
                                <label class="form-label">Industry</label>
                                <select class="form-control" id="industry">
                                    <option value="">Select industry</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="retail">Retail</option>
                                    <option value="services">Services</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="financial">Financial</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label">Company Size</label>
                                <select class="form-control" id="companySize">
                                    <option value="">Select size</option>
                                    <option value="small">Small (< 50 employees)</option>
                                    <option value="medium">Medium (50-500 employees)</option>
                                    <option value="large">Large (> 500 employees)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Audit Period</h3>
                        </div>
                        <div class="card-body space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="form-label">Start Date</label>
                                    <input type="date" class="form-control" id="auditPeriodStart">
                                </div>
                                <div>
                                    <label class="form-label">End Date</label>
                                    <input type="date" class="form-control" id="auditPeriodEnd">
                                </div>
                            </div>
                            <div>
                                <label class="form-label">Fiscal Year End</label>
                                <input type="date" class="form-control" id="fiscalYearEnd">
                            </div>
                        </div>
                    </div>
                </div>
                
                ${this.renderNavigationButtons(1)}
            </div>
        `;
    }
    
    // Step 3: Data Upload
    renderDataUpload() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Data Upload</h2>
                    <p class="text-gray-600">Upload or connect to data sources for the audit</p>
                </div>
                
                <div class="card mb-8">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">File Upload</h3>
                    </div>
                    <div class="card-body">
                        <div class="file-upload-area" onclick="document.getElementById('fileInput').click()">
                            <i data-lucide="upload" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <p class="text-lg font-medium text-gray-900 mb-2">Upload Files</p>
                            <p class="text-gray-500 mb-4">Drag and drop files here or click to browse</p>
                            <input type="file" id="fileInput" class="hidden" multiple>
                            <button type="button" class="btn btn-outline">Choose Files</button>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">System Integration</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="form-label">System Type</label>
                                <select class="form-control" id="systemType">
                                    <option value="">Select system</option>
                                    <option value="erp">ERP System</option>
                                    <option value="accounting">Accounting Software</option>
                                    <option value="database">Database</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label">Connection Status</label>
                                <div class="flex items-center space-x-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Not Connected
                                    </span>
                                    <button type="button" class="btn btn-primary btn-sm">Connect</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${this.renderNavigationButtons(2)}
            </div>
        `;
    }
    
    // Step 4: Account Mapping
    renderAccountMapping() {
        return `
            <div class="max-w-6xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Account Mapping</h2>
                    <p class="text-gray-600">Map client accounts to standard audit categories</p>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold">Chart of Accounts Mapping</h3>
                            <button type="button" class="btn btn-outline">
                                <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                                Import Mapping
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Account Code</th>
                                        <th>Account Name</th>
                                        <th>Balance</th>
                                        <th>Category</th>
                                        <th>Risk Level</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1000</td>
                                        <td>Cash and Cash Equivalents</td>
                                        <td>$150,000</td>
                                        <td>
                                            <select class="form-control">
                                                <option>Current Assets</option>
                                                <option>Non-Current Assets</option>
                                                <option>Liabilities</option>
                                                <option>Equity</option>
                                                <option>Revenue</option>
                                                <option>Expenses</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select class="form-control">
                                                <option>Low</option>
                                                <option>Medium</option>
                                                <option>High</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button type="button" class="text-blue-600 hover:text-blue-800">
                                                <i data-lucide="edit" class="w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>1100</td>
                                        <td>Accounts Receivable</td>
                                        <td>$300,000</td>
                                        <td>
                                            <select class="form-control">
                                                <option>Current Assets</option>
                                                <option>Non-Current Assets</option>
                                                <option>Liabilities</option>
                                                <option>Equity</option>
                                                <option>Revenue</option>
                                                <option>Expenses</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select class="form-control">
                                                <option>Low</option>
                                                <option selected>Medium</option>
                                                <option>High</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button type="button" class="text-blue-600 hover:text-blue-800">
                                                <i data-lucide="edit" class="w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                ${this.renderNavigationButtons(3)}
            </div>
        `;
    }
    
    // Step 5: Risk Analysis
    renderRiskAnalysis() {
        return `
            <div class="max-w-6xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Risk Analysis</h2>
                    <p class="text-gray-600">AI-powered risk assessment and materiality calculations</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Risk Score -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Overall Risk Score</h3>
                        </div>
                        <div class="card-body text-center">
                            <div class="text-4xl font-bold text-yellow-600 mb-2">72</div>
                            <div class="text-sm text-gray-600 mb-4">Medium Risk</div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-yellow-500" style="width: 72%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Materiality -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Materiality</h3>
                        </div>
                        <div class="card-body">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span>Overall Materiality:</span>
                                    <span class="font-semibold">$50,000</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Performance Materiality:</span>
                                    <span class="font-semibold">$37,500</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Trivial Threshold:</span>
                                    <span class="font-semibold">$2,500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- AI Analysis -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">AI Analysis</h3>
                        </div>
                        <div class="card-body">
                            <button type="button" class="btn btn-primary w-full" onclick="workflowSteps.generateAIAnalysis()">
                                <i data-lucide="brain" class="w-4 h-4 mr-2"></i>
                                Generate Analysis
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Risk Areas -->
                <div class="card mt-8">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Identified Risk Areas</h3>
                    </div>
                    <div class="card-body">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                <div class="flex items-center">
                                    <i data-lucide="alert-triangle" class="w-5 h-5 text-red-500 mr-3"></i>
                                    <div>
                                        <div class="font-medium text-red-900">Revenue Recognition</div>
                                        <div class="text-sm text-red-700">Complex contracts and timing issues</div>
                                    </div>
                                </div>
                                <span class="badge badge-error">High Risk</span>
                            </div>
                            
                            <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                                <div class="flex items-center">
                                    <i data-lucide="alert-circle" class="w-5 h-5 text-yellow-500 mr-3"></i>
                                    <div>
                                        <div class="font-medium text-yellow-900">Inventory Valuation</div>
                                        <div class="text-sm text-yellow-700">Obsolescence and pricing concerns</div>
                                    </div>
                                </div>
                                <span class="badge badge-warning">Medium Risk</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${this.renderNavigationButtons(4)}
            </div>
        `;
    }
    
    // Render navigation buttons
    renderNavigationButtons(step) {
        const isFirstStep = step === 0;
        const isLastStep = step === this.steps.length - 1;
        
        return `
            <div class="flex justify-between mt-8">
                ${!isFirstStep ? `
                    <button class="btn btn-secondary" onclick="workflowSteps.goToPreviousStep()">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                        Previous
                    </button>
                ` : '<div></div>'}
                
                ${!isLastStep ? `
                    <button class="btn btn-primary" onclick="workflowSteps.goToNextStep()">
                        Continue
                        <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                    </button>
                ` : `
                    <button class="btn btn-success" onclick="workflowSteps.completeAudit()">
                        Complete Audit
                        <i data-lucide="check" class="w-4 h-4 ml-2"></i>
                    </button>
                `}
            </div>
        `;
    }
    
    // Navigation methods
    goToPreviousStep() {
        if (this.currentStep > 0) {
            window.app.setState({ step: this.currentStep - 1 });
            window.app.renderApp();
        }
    }
    
    goToNextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.saveCurrentStepData();
            window.app.setState({ step: this.currentStep + 1 });
            window.app.renderApp();
        }
    }
    
    completeAudit() {
        this.saveCurrentStepData();
        window.app.setState({ currentView: 'reports' });
        window.app.renderApp();
    }
    
    // Save current step data
    saveCurrentStepData() {
        const stepId = this.steps[this.currentStep].id;
        console.log(`Saving data for step: ${stepId}`);
        // Implementation for saving step data would go here
    }
    
    // Generate AI analysis
    generateAIAnalysis() {
        console.log('Generating AI analysis...');
        // Implementation would integrate with Gemini API
    }
    
    // Error rendering
    renderError(message) {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="card">
                    <div class="card-body text-center py-12">
                        <i data-lucide="alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4"></i>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                        <p class="text-gray-600">${message}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Placeholder for remaining steps
    renderAuditPlanning() {
        return this.renderPlaceholderStep('Audit Planning', 'Develop comprehensive audit procedures and assign team resources');
    }
    
    renderTaskManagement() {
        return this.renderPlaceholderStep('Task Management', 'Manage audit tasks with Kanban board and approval workflows');
    }
    
    renderReconciliation() {
        return this.renderPlaceholderStep('Reconciliation', 'Perform detailed reconciliation and testing procedures');
    }
    
    renderReports() {
        return this.renderPlaceholderStep('Reports', 'Generate comprehensive audit reports and management letters');
    }
    
    renderPlaceholderStep(title, description) {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="card">
                    <div class="card-body text-center py-12">
                        <i data-lucide="construction" class="w-12 h-12 text-blue-500 mx-auto mb-4"></i>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${title}</h3>
                        <p class="text-gray-600 mb-6">${description}</p>
                        <p class="text-sm text-gray-500">This step is under development and will be available soon.</p>
                    </div>
                </div>
                
                ${this.renderNavigationButtons(this.currentStep)}
            </div>
        `;
    }
}

// Export to global scope
window.workflowSteps = new WorkflowStepsComponents();