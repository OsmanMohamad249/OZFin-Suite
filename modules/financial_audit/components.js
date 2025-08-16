// Financial Audit Module Components
// UI components specific to financial audit workflows

class FinancialAuditComponents {
    constructor() {
        this.currentStep = 0;
        this.auditData = {};
        this.i18n = window.AuditPulse?.i18n || { t: (key) => key };
    }
    
    // Render activity selection step
    renderActivitySelection() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Financial Audit Setup</h2>
                    <p class="text-gray-600">Configure your financial audit parameters and scope</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Audit Scope Configuration -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Audit Scope</h3>
                        </div>
                        <div class="card-body space-y-4">
                            <div>
                                <label class="form-label">Audit Type</label>
                                <select class="form-control" id="auditScope">
                                    <option value="full">Full Financial Statement Audit</option>
                                    <option value="limited">Limited Scope Audit</option>
                                    <option value="review">Financial Statement Review</option>
                                    <option value="compilation">Compilation Engagement</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="form-label">Reporting Framework</label>
                                <select class="form-control" id="framework">
                                    <option value="ifrs">IFRS</option>
                                    <option value="gaap">US GAAP</option>
                                    <option value="local">Local GAAP</option>
                                    <option value="other">Other Framework</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="form-label">Materiality Basis</label>
                                <select class="form-control" id="materialityBasis">
                                    <option value="netIncome">Net Income (5%)</option>
                                    <option value="revenue">Revenue (0.5%)</option>
                                    <option value="totalAssets">Total Assets (0.5%)</option>
                                    <option value="grossProfit">Gross Profit (5%)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Key Risk Areas -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Focus Areas</h3>
                        </div>
                        <div class="card-body">
                            <div class="space-y-3">
                                ${this.renderRiskAreaCheckboxes()}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Audit Objectives -->
                <div class="card mt-8">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Audit Objectives</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${this.renderAuditObjectives()}
                        </div>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="flex justify-between mt-8">
                    <button class="btn btn-secondary" onclick="app.setState({currentView: 'dashboard'}); app.renderApp();">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                        Back to Dashboard
                    </button>
                    <button class="btn btn-primary" onclick="financialAudit.saveActivitySelection(); app.setState({step: 1}); app.renderApp();">
                        Continue
                        <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // Render company information step
    renderCompanyInfo() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                    <p class="text-gray-600">Gather essential client information and business understanding</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Basic Company Details -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Company Details</h3>
                        </div>
                        <div class="card-body space-y-4">
                            <div>
                                <label class="form-label">Company Name *</label>
                                <input type="text" class="form-control" id="companyName" placeholder="Enter company name" required>
                            </div>
                            
                            <div>
                                <label class="form-label">Legal Structure</label>
                                <select class="form-control" id="legalStructure">
                                    <option value="">Select structure</option>
                                    <option value="corporation">Corporation</option>
                                    <option value="llc">LLC</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="sole_proprietorship">Sole Proprietorship</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="form-label">Industry</label>
                                <select class="form-control" id="industry">
                                    <option value="">Select industry</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="retail">Retail & Distribution</option>
                                    <option value="services">Professional Services</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="real_estate">Real Estate</option>
                                    <option value="financial">Financial Services</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="form-label">Address</label>
                                <textarea class="form-control" id="companyAddress" rows="3" placeholder="Enter company address"></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Audit Period Information -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Audit Period</h3>
                        </div>
                        <div class="card-body space-y-4">
                            <div>
                                <label class="form-label">Fiscal Year End *</label>
                                <input type="date" class="form-control" id="fiscalYearEnd" required>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="form-label">Audit Period Start</label>
                                    <input type="date" class="form-control" id="auditPeriodStart">
                                </div>
                                <div>
                                    <label class="form-label">Audit Period End</label>
                                    <input type="date" class="form-control" id="auditPeriodEnd">
                                </div>
                            </div>
                            
                            <div>
                                <label class="form-label">Previous Auditor</label>
                                <input type="text" class="form-control" id="previousAuditor" placeholder="Enter previous auditor name">
                            </div>
                            
                            <div>
                                <label class="form-label">First Year Audit?</label>
                                <div class="flex space-x-4">
                                    <label class="flex items-center">
                                        <input type="radio" name="firstYear" value="yes" class="mr-2">
                                        Yes
                                    </label>
                                    <label class="flex items-center">
                                        <input type="radio" name="firstYear" value="no" class="mr-2">
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Key Personnel -->
                <div class="card mt-8">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Key Personnel</h3>
                    </div>
                    <div class="card-body">
                        <div id="keyPersonnel">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" placeholder="Full name">
                                </div>
                                <div>
                                    <label class="form-label">Position</label>
                                    <input type="text" class="form-control" placeholder="Job title">
                                </div>
                                <div>
                                    <label class="form-label">Contact</label>
                                    <input type="email" class="form-control" placeholder="Email address">
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-outline" onclick="financialAudit.addPersonnelRow()">
                            <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                            Add Person
                        </button>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="flex justify-between mt-8">
                    <button class="btn btn-secondary" onclick="app.setState({step: 0}); app.renderApp();">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                        Back
                    </button>
                    <button class="btn btn-primary" onclick="financialAudit.saveCompanyInfo(); app.setState({step: 2}); app.renderApp();">
                        Continue
                        <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // Render data upload step
    renderDataUpload() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Data Import</h2>
                    <p class="text-gray-600">Import financial data from various sources</p>
                </div>
                
                <!-- Upload Options -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <!-- File Upload -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold flex items-center">
                                <i data-lucide="upload" class="w-5 h-5 mr-2"></i>
                                File Upload
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="file-upload-area" id="fileUploadArea" 
                                 ondrop="financialAudit.handleFileDrop(event)" 
                                 ondragover="event.preventDefault()" 
                                 ondragenter="event.preventDefault()">
                                <i data-lucide="file-plus" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                                <p class="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
                                <p class="text-gray-500 mb-4">or click to browse</p>
                                <input type="file" id="fileInput" class="hidden" multiple 
                                       accept=".xlsx,.xls,.csv,.json"
                                       onchange="financialAudit.handleFileSelect(event)">
                                <button type="button" class="btn btn-outline" onclick="document.getElementById('fileInput').click()">
                                    Browse Files
                                </button>
                            </div>
                            
                            <div class="mt-4">
                                <p class="text-sm text-gray-600">Supported formats: Excel (.xlsx, .xls), CSV, JSON</p>
                                <p class="text-sm text-gray-600">Maximum file size: 50MB</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ERP Integration -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold flex items-center">
                                <i data-lucide="database" class="w-5 h-5 mr-2"></i>
                                ERP Integration
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="space-y-4">
                                <div>
                                    <label class="form-label">ERP System</label>
                                    <select class="form-control" id="erpSystem">
                                        <option value="">Select ERP system</option>
                                        <option value="sap">SAP</option>
                                        <option value="oracle">Oracle</option>
                                        <option value="dynamics">Microsoft Dynamics</option>
                                        <option value="netsuite">NetSuite</option>
                                        <option value="quickbooks">QuickBooks</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="form-label">Connection String</label>
                                    <input type="text" class="form-control" id="connectionString" 
                                           placeholder="Enter connection details">
                                </div>
                                
                                <button type="button" class="btn btn-primary w-full" onclick="financialAudit.testERPConnection()">
                                    <i data-lucide="link" class="w-4 h-4 mr-2"></i>
                                    Test Connection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Upload Progress -->
                <div id="uploadProgress" class="card hidden">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Upload Progress</h3>
                    </div>
                    <div class="card-body">
                        <div id="progressList"></div>
                    </div>
                </div>
                
                <!-- Uploaded Files List -->
                <div id="uploadedFiles" class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold">Uploaded Data Files</h3>
                    </div>
                    <div class="card-body">
                        <div id="filesList">
                            <div class="text-center py-8 text-gray-500">
                                No files uploaded yet
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="flex justify-between mt-8">
                    <button class="btn btn-secondary" onclick="app.setState({step: 1}); app.renderApp();">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                        Back
                    </button>
                    <button class="btn btn-primary" onclick="financialAudit.processUploadedData(); app.setState({step: 3}); app.renderApp();">
                        Continue
                        <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // Render risk assessment results
    renderRiskAssessment() {
        return `
            <div class="max-w-6xl mx-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Risk Assessment</h2>
                    <p class="text-gray-600">AI-powered risk analysis and materiality calculations</p>
                </div>
                
                <!-- Overall Risk Score -->
                <div class="card mb-8">
                    <div class="card-body">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">Overall Risk Score</h3>
                                <p class="text-gray-600">Based on financial analysis and industry benchmarks</p>
                            </div>
                            <div class="text-right">
                                <div class="text-3xl font-bold text-primary-600" id="riskScore">75</div>
                                <div class="text-sm text-gray-500">Medium Risk</div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Risk Areas -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">High Risk Areas</h3>
                        </div>
                        <div class="card-body">
                            <div id="highRiskAreas" class="space-y-4">
                                ${this.renderRiskAreaItems()}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Materiality Calculations -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-lg font-semibold">Materiality Thresholds</h3>
                        </div>
                        <div class="card-body">
                            <div id="materialityThresholds" class="space-y-4">
                                ${this.renderMaterialityItems()}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- AI Recommendations -->
                <div class="card mb-8">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold flex items-center">
                            <i data-lucide="brain" class="w-5 h-5 mr-2"></i>
                            AI Risk Analysis
                        </h3>
                    </div>
                    <div class="card-body">
                        <div id="aiAnalysis" class="bg-blue-50 p-4 rounded-lg">
                            <div class="animate-pulse">Analyzing financial data and generating recommendations...</div>
                        </div>
                        
                        <button type="button" class="btn btn-primary mt-4" onclick="financialAudit.generateAIAnalysis()">
                            <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                            Regenerate Analysis
                        </button>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="flex justify-between mt-8">
                    <button class="btn btn-secondary" onclick="app.setState({step: 3}); app.renderApp();">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                        Back
                    </button>
                    <button class="btn btn-primary" onclick="financialAudit.saveRiskAssessment(); app.setState({step: 5}); app.renderApp();">
                        Continue
                        <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    // Helper method to render risk area checkboxes
    renderRiskAreaCheckboxes() {
        const riskAreas = [
            'Revenue Recognition',
            'Inventory Valuation',
            'Accounts Receivable',
            'Fixed Assets',
            'Debt and Borrowings',
            'Management Override'
        ];
        
        return riskAreas.map(area => `
            <label class="flex items-center">
                <input type="checkbox" class="mr-3" value="${area}" checked>
                <span class="text-sm">${area}</span>
            </label>
        `).join('');
    }
    
    // Helper method to render audit objectives
    renderAuditObjectives() {
        const objectives = [
            'Existence/Occurrence',
            'Completeness',
            'Accuracy/Valuation',
            'Cut-off',
            'Classification',
            'Rights and Obligations',
            'Presentation and Disclosure'
        ];
        
        return objectives.map(objective => `
            <label class="flex items-center">
                <input type="checkbox" class="mr-3" value="${objective}" checked>
                <span class="text-sm">${objective}</span>
            </label>
        `).join('');
    }
    
    // Helper method to render risk area items
    renderRiskAreaItems() {
        return `
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                    <div class="font-medium text-red-900">Revenue Recognition</div>
                    <div class="text-sm text-red-700">Complex contracts and cut-off issues</div>
                </div>
                <span class="badge badge-error">High</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                    <div class="font-medium text-yellow-900">Inventory Valuation</div>
                    <div class="text-sm text-yellow-700">Obsolescence and pricing concerns</div>
                </div>
                <span class="badge badge-warning">Medium</span>
            </div>
        `;
    }
    
    // Helper method to render materiality items
    renderMaterialityItems() {
        return `
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Overall Materiality</span>
                <span class="font-bold">$50,000</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Performance Materiality</span>
                <span class="font-bold">$37,500</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Trivial Threshold</span>
                <span class="font-bold">$2,500</span>
            </div>
        `;
    }
    
    // Method to save activity selection
    saveActivitySelection() {
        const auditScope = document.getElementById('auditScope')?.value;
        const framework = document.getElementById('framework')?.value;
        const materialityBasis = document.getElementById('materialityBasis')?.value;
        
        this.auditData.activitySelection = {
            auditScope,
            framework,
            materialityBasis,
            timestamp: new Date().toISOString()
        };
        
        console.log('Activity selection saved:', this.auditData.activitySelection);
    }
    
    // Method to save company information
    saveCompanyInfo() {
        const companyInfo = {
            name: document.getElementById('companyName')?.value,
            legalStructure: document.getElementById('legalStructure')?.value,
            industry: document.getElementById('industry')?.value,
            address: document.getElementById('companyAddress')?.value,
            fiscalYearEnd: document.getElementById('fiscalYearEnd')?.value,
            auditPeriodStart: document.getElementById('auditPeriodStart')?.value,
            auditPeriodEnd: document.getElementById('auditPeriodEnd')?.value,
            previousAuditor: document.getElementById('previousAuditor')?.value,
            firstYear: document.querySelector('input[name="firstYear"]:checked')?.value,
            timestamp: new Date().toISOString()
        };
        
        this.auditData.companyInfo = companyInfo;
        console.log('Company info saved:', this.auditData.companyInfo);
    }
    
    // Method to add personnel row
    addPersonnelRow() {
        const container = document.getElementById('keyPersonnel');
        const newRow = document.createElement('div');
        newRow.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4';
        newRow.innerHTML = `
            <div>
                <input type="text" class="form-control" placeholder="Full name">
            </div>
            <div>
                <input type="text" class="form-control" placeholder="Job title">
            </div>
            <div class="flex gap-2">
                <input type="email" class="form-control" placeholder="Email address">
                <button type="button" class="btn btn-danger" onclick="this.closest('.grid').remove()">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        container.appendChild(newRow);
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // File handling methods
    handleFileDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        this.processFiles(files);
    }
    
    handleFileSelect(event) {
        const files = event.target.files;
        this.processFiles(files);
    }
    
    processFiles(files) {
        const filesList = document.getElementById('filesList');
        const progressContainer = document.getElementById('uploadProgress');
        const progressList = document.getElementById('progressList');
        
        // Show progress container
        progressContainer.classList.remove('hidden');
        
        // Clear existing content
        filesList.innerHTML = '';
        progressList.innerHTML = '';
        
        Array.from(files).forEach(file => {
            // Add to progress list
            const progressItem = document.createElement('div');
            progressItem.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm">${file.name}</span>
                    <span class="text-sm text-gray-500">${this.formatFileSize(file.size)}</span>
                </div>
                <div class="progress-bar mb-4">
                    <div class="progress-fill" style="width: 0%" data-file="${file.name}"></div>
                </div>
            `;
            progressList.appendChild(progressItem);
            
            // Simulate file processing
            this.simulateFileUpload(file, progressItem);
        });
    }
    
    simulateFileUpload(file, progressItem) {
        const progressBar = progressItem.querySelector('.progress-fill');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                this.addToFilesList(file);
            }
            progressBar.style.width = progress + '%';
        }, 500);
    }
    
    addToFilesList(file) {
        const filesList = document.getElementById('filesList');
        
        if (filesList.querySelector('.text-center')) {
            filesList.innerHTML = '';
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-3';
        fileItem.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="file" class="w-5 h-5 text-gray-400 mr-3"></i>
                <div>
                    <div class="font-medium">${file.name}</div>
                    <div class="text-sm text-gray-500">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <span class="badge badge-success">Uploaded</span>
                <button type="button" class="text-red-600 hover:text-red-800" onclick="this.closest('.flex').remove()">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        filesList.appendChild(fileItem);
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // ERP connection test
    testERPConnection() {
        const erpSystem = document.getElementById('erpSystem').value;
        const connectionString = document.getElementById('connectionString').value;
        
        if (!erpSystem || !connectionString) {
            alert('Please select ERP system and enter connection string');
            return;
        }
        
        // Simulate connection test
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 mr-2 animate-spin"></i> Testing...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4 mr-2"></i> Connection Successful';
            btn.className = 'btn btn-success w-full';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.className = 'btn btn-primary w-full';
                btn.disabled = false;
            }, 2000);
        }, 2000);
    }
    
    // Process uploaded data
    processUploadedData() {
        console.log('Processing uploaded financial data...');
        // Implementation for data processing would go here
    }
    
    // Generate AI analysis
    async generateAIAnalysis() {
        const analysisContainer = document.getElementById('aiAnalysis');
        analysisContainer.innerHTML = '<div class="animate-pulse">Generating AI analysis...</div>';
        
        try {
            // Simulate AI analysis
            setTimeout(() => {
                analysisContainer.innerHTML = `
                    <div class="space-y-4">
                        <h4 class="font-semibold">Key Risk Insights:</h4>
                        <ul class="list-disc list-inside space-y-2 text-sm">
                            <li>Revenue growth of 35% indicates potential revenue recognition risks requiring detailed substantive testing</li>
                            <li>Inventory turnover has decreased by 15% suggesting potential obsolescence issues</li>
                            <li>Days sales outstanding has increased, indicating potential collectibility concerns</li>
                            <li>Debt-to-equity ratio is within acceptable limits but should be monitored</li>
                        </ul>
                        
                        <h4 class="font-semibold mt-4">Recommended Procedures:</h4>
                        <ul class="list-disc list-inside space-y-2 text-sm">
                            <li>Perform detailed revenue cut-off testing for Q4 transactions</li>
                            <li>Conduct physical inventory observation with focus on obsolete items</li>
                            <li>Increase accounts receivable confirmation sample size</li>
                            <li>Review subsequent collections and credit memo activity</li>
                        </ul>
                    </div>
                `;
            }, 2000);
        } catch (error) {
            analysisContainer.innerHTML = '<div class="text-red-600">Error generating AI analysis. Please try again.</div>';
        }
    }
    
    // Save risk assessment
    saveRiskAssessment() {
        this.auditData.riskAssessment = {
            overallScore: 75,
            highRiskAreas: ['Revenue Recognition', 'Inventory Valuation'],
            materiality: 50000,
            performanceMmateriality: 37500,
            trivialThreshold: 2500,
            timestamp: new Date().toISOString()
        };
        
        console.log('Risk assessment saved:', this.auditData.riskAssessment);
    }
}

// Export to global scope
window.financialAudit = new FinancialAuditComponents();