// AuditPulse Reports Components
// Report generation, export, and management functionality

class ReportsComponents {
    constructor() {
        this.reportTemplates = {};
        this.currentReport = null;
        this.i18n = window.AuditPulse?.i18n || { t: (key) => key };
    }
    
    // Main reports dashboard
    renderReports() {
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
                                <h1 class="text-xl font-semibold text-gray-900">Audit Reports</h1>
                                <p class="text-sm text-gray-500">Generate and manage audit reports</p>
                            </div>
                            <div class="flex items-center space-x-3">
                                <button class="btn btn-outline" onclick="reports.exportAllReports()">
                                    <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                                    Export All
                                </button>
                                <button class="btn btn-primary" onclick="reports.createNewReport()">
                                    <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                                    New Report
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <!-- Main Content -->
                <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Report Types -->
                        <div class="lg:col-span-1">
                            ${this.renderReportTypes()}
                        </div>
                        
                        <!-- Report Preview/Content -->
                        <div class="lg:col-span-2">
                            ${this.renderReportContent()}
                        </div>
                    </div>
                </main>
            </div>
        `;
    }
    
    // Render available report types
    renderReportTypes() {
        const reportTypes = [
            {
                id: 'audit_report',
                name: 'Auditor\'s Report',
                description: 'Independent auditor\'s report with opinion',
                icon: 'file-text',
                status: 'ready'
            },
            {
                id: 'management_letter',
                name: 'Management Letter',
                description: 'Internal control recommendations',
                icon: 'mail',
                status: 'draft'
            },
            {
                id: 'financial_statements',
                name: 'Financial Statements',
                description: 'Audited financial statements',
                icon: 'calculator',
                status: 'ready'
            },
            {
                id: 'working_papers',
                name: 'Working Papers',
                description: 'Detailed audit working papers',
                icon: 'folder',
                status: 'in_progress'
            },
            {
                id: 'risk_assessment',
                name: 'Risk Assessment Report',
                description: 'Comprehensive risk analysis',
                icon: 'alert-triangle',
                status: 'ready'
            },
            {
                id: 'compliance_report',
                name: 'Compliance Report',
                description: 'Regulatory compliance status',
                icon: 'shield-check',
                status: 'pending'
            }
        ];
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="text-lg font-semibold text-gray-900">Report Types</h3>
                </div>
                <div class="card-body">
                    <div class="space-y-3">
                        ${reportTypes.map(type => `
                            <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all"
                                 onclick="reports.selectReportType('${type.id}')">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <i data-lucide="${type.icon}" class="w-4 h-4 text-primary-600"></i>
                                    </div>
                                </div>
                                <div class="ml-3 flex-1">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-sm font-medium text-gray-900">${type.name}</h4>
                                        <span class="badge ${this.getStatusBadgeClass(type.status)}">${type.status}</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">${type.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render report content area
    renderReportContent() {
        return `
            <div class="space-y-6">
                <!-- Report Generator -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold text-gray-900">Generate Reports</h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="form-label">Report Type</label>
                                <select class="form-control" id="reportType">
                                    <option value="audit_report">Auditor's Report</option>
                                    <option value="management_letter">Management Letter</option>
                                    <option value="financial_statements">Financial Statements</option>
                                    <option value="working_papers">Working Papers</option>
                                    <option value="risk_assessment">Risk Assessment</option>
                                    <option value="compliance_report">Compliance Report</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="form-label">Output Format</label>
                                <select class="form-control" id="outputFormat">
                                    <option value="pdf">PDF Document</option>
                                    <option value="excel">Excel Workbook</option>
                                    <option value="word">Word Document</option>
                                    <option value="html">HTML Report</option>
                                </select>
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="form-label">Report Period</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="date" class="form-control" id="reportStartDate">
                                    <input type="date" class="form-control" id="reportEndDate">
                                </div>
                            </div>
                            
                            <div class="md:col-span-2">
                                <button type="button" class="btn btn-primary" onclick="reports.generateReport()">
                                    <i data-lucide="file-plus" class="w-4 h-4 mr-2"></i>
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Report Preview -->
                <div class="card">
                    <div class="card-header">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">Report Preview</h3>
                            <div class="flex items-center space-x-2">
                                <button class="btn btn-outline btn-sm" onclick="reports.previewReport()">
                                    <i data-lucide="eye" class="w-4 h-4 mr-2"></i>
                                    Preview
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="reports.downloadReport()">
                                    <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="reportPreview" class="bg-gray-50 p-6 rounded-lg min-h-96">
                            ${this.renderSampleAuditorReport()}
                        </div>
                    </div>
                </div>
                
                <!-- Generated Reports History -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-semibold text-gray-900">Generated Reports</h3>
                    </div>
                    <div class="card-body">
                        ${this.renderReportHistory()}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render sample auditor's report
    renderSampleAuditorReport() {
        const currentDate = new Date().toLocaleDateString();
        
        return `
            <div class="bg-white p-8 rounded-lg shadow-sm border">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">INDEPENDENT AUDITOR'S REPORT</h2>
                    <p class="text-gray-600">To the Board of Directors and Shareholders</p>
                    <p class="text-gray-600 font-semibold">Sample Corporation</p>
                </div>
                
                <div class="space-y-6">
                    <section>
                        <h3 class="font-bold text-gray-900 mb-3">Opinion</h3>
                        <p class="text-gray-700 leading-relaxed">
                            We have audited the financial statements of Sample Corporation, which comprise the 
                            balance sheet as of December 31, 2024, and the related statements of income, 
                            retained earnings, and cash flows for the year then ended, and the related 
                            notes to the financial statements.
                        </p>
                        <p class="text-gray-700 leading-relaxed mt-3">
                            In our opinion, the accompanying financial statements present fairly, in all 
                            material respects, the financial position of Sample Corporation as of 
                            December 31, 2024, and the results of its operations and its cash flows for 
                            the year then ended in accordance with International Financial Reporting Standards.
                        </p>
                    </section>
                    
                    <section>
                        <h3 class="font-bold text-gray-900 mb-3">Basis for Opinion</h3>
                        <p class="text-gray-700 leading-relaxed">
                            We conducted our audit in accordance with International Standards on Auditing. 
                            Our responsibilities under those standards are further described in the 
                            Auditor's Responsibilities for the Audit of the Financial Statements section 
                            of our report.
                        </p>
                    </section>
                    
                    <section>
                        <h3 class="font-bold text-gray-900 mb-3">Key Audit Matters</h3>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 class="font-semibold text-yellow-900 mb-2">Revenue Recognition</h4>
                            <p class="text-yellow-800 text-sm">
                                The company has complex revenue arrangements that require significant 
                                judgment in determining the timing and amount of revenue recognition.
                            </p>
                        </div>
                    </section>
                    
                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <div class="grid grid-cols-2 gap-8">
                            <div>
                                <p class="font-semibold text-gray-900">AuditPulse Professional Services</p>
                                <p class="text-gray-600 text-sm">Certified Public Accountants</p>
                                <p class="text-gray-600 text-sm mt-2">${currentDate}</p>
                            </div>
                            <div class="text-right">
                                <div class="w-32 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
                                    <span class="text-gray-500 text-xs">Digital Signature</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render report history
    renderReportHistory() {
        const reports = [
            {
                id: '001',
                name: 'Q4 2024 Financial Audit Report',
                type: 'audit_report',
                format: 'PDF',
                size: '2.4 MB',
                generated: '2024-12-15',
                status: 'completed'
            },
            {
                id: '002',
                name: 'Internal Controls Management Letter',
                type: 'management_letter',
                format: 'Word',
                size: '1.2 MB',
                generated: '2024-12-14',
                status: 'completed'
            },
            {
                id: '003',
                name: 'Risk Assessment Report 2024',
                type: 'risk_assessment',
                format: 'Excel',
                size: '3.1 MB',
                generated: '2024-12-13',
                status: 'completed'
            }
        ];
        
        return `
            <div class="overflow-x-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Report Name</th>
                            <th>Type</th>
                            <th>Format</th>
                            <th>Size</th>
                            <th>Generated</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reports.map(report => `
                            <tr>
                                <td class="font-medium">${report.name}</td>
                                <td>
                                    <span class="badge badge-info">${report.type.replace('_', ' ')}</span>
                                </td>
                                <td>${report.format}</td>
                                <td>${report.size}</td>
                                <td>${report.generated}</td>
                                <td>
                                    <span class="badge badge-success">${report.status}</span>
                                </td>
                                <td>
                                    <div class="flex items-center space-x-2">
                                        <button class="text-blue-600 hover:text-blue-800" onclick="reports.downloadReport('${report.id}')" title="Download">
                                            <i data-lucide="download" class="w-4 h-4"></i>
                                        </button>
                                        <button class="text-green-600 hover:text-green-800" onclick="reports.viewReport('${report.id}')" title="View">
                                            <i data-lucide="eye" class="w-4 h-4"></i>
                                        </button>
                                        <button class="text-yellow-600 hover:text-yellow-800" onclick="reports.editReport('${report.id}')" title="Edit">
                                            <i data-lucide="edit" class="w-4 h-4"></i>
                                        </button>
                                        <button class="text-red-600 hover:text-red-800" onclick="reports.deleteReport('${report.id}')" title="Delete">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Helper methods
    getStatusBadgeClass(status) {
        switch (status) {
            case 'ready': return 'badge-success';
            case 'draft': return 'badge-warning';
            case 'in_progress': return 'badge-info';
            case 'pending': return 'badge-error';
            default: return 'badge-info';
        }
    }
    
    // Action methods
    selectReportType(typeId) {
        console.log(`Selected report type: ${typeId}`);
        document.getElementById('reportType').value = typeId;
    }
    
    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
        
        console.log('Generating report:', { reportType, outputFormat, startDate, endDate });
        
        // Show loading state
        const preview = document.getElementById('reportPreview');
        preview.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p class="text-gray-600">Generating ${reportType.replace('_', ' ')} report...</p>
                </div>
            </div>
        `;
        
        // Simulate report generation
        setTimeout(() => {
            preview.innerHTML = this.renderSampleAuditorReport();
            window.app.showNotification(`${reportType.replace('_', ' ')} report generated successfully`, 'success');
        }, 2000);
    }
    
    previewReport() {
        console.log('Previewing report...');
        // Implementation for report preview
    }
    
    downloadReport(reportId = null) {
        if (reportId) {
            console.log(`Downloading report: ${reportId}`);
        } else {
            console.log('Downloading current report...');
        }
        
        // Simulate download
        window.app.showNotification('Report download started', 'success');
    }
    
    viewReport(reportId) {
        console.log(`Viewing report: ${reportId}`);
        // Implementation for viewing report
    }
    
    editReport(reportId) {
        console.log(`Editing report: ${reportId}`);
        // Implementation for editing report
    }
    
    deleteReport(reportId) {
        if (confirm('Are you sure you want to delete this report?')) {
            console.log(`Deleting report: ${reportId}`);
            // Implementation for deleting report
            window.app.showNotification('Report deleted successfully', 'success');
        }
    }
    
    createNewReport() {
        console.log('Creating new report...');
        // Implementation for creating new report
    }
    
    exportAllReports() {
        console.log('Exporting all reports...');
        // Implementation for exporting all reports
        window.app.showNotification('Exporting all reports...', 'info');
    }
    
    // Generate specific report types
    generateAuditorReport(auditData) {
        // Implementation for generating auditor's report
        console.log('Generating auditor report with data:', auditData);
    }
    
    generateManagementLetter(findings, recommendations) {
        // Implementation for generating management letter
        console.log('Generating management letter with findings:', findings);
    }
    
    generateFinancialStatements(financialData) {
        // Implementation for generating financial statements
        console.log('Generating financial statements with data:', financialData);
    }
    
    generateWorkingPapers(auditProcedures, evidence) {
        // Implementation for generating working papers
        console.log('Generating working papers with procedures:', auditProcedures);
    }
    
    generateRiskAssessmentReport(riskData) {
        // Implementation for generating risk assessment report
        console.log('Generating risk assessment report with data:', riskData);
    }
    
    generateComplianceReport(complianceData) {
        // Implementation for generating compliance report
        console.log('Generating compliance report with data:', complianceData);
    }
}

// Export to global scope
window.reports = new ReportsComponents();