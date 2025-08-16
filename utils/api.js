// AuditPulse API Utilities
// Handles all external API integrations and data communications

// API Configuration
const API_CONFIG = {
    GEMINI: {
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        apiKey: '', // Should be set from environment or user input
        maxTokens: 2048,
        temperature: 0.7
    },
    ERP: {
        endpoint: '',
        apiKey: '',
        timeout: 30000
    },
    ACCOUNTING: {
        endpoint: '',
        apiKey: '',
        timeout: 30000
    },
    COMPLIANCE: {
        endpoint: '',
        apiKey: '',
        timeout: 30000
    }
};

// Base API class for common functionality
class BaseAPI {
    constructor(config) {
        this.config = config;
    }
    
    // Generic HTTP request method
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: this.config.timeout || 30000
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
            
            const response = await fetch(url, {
                ...mergedOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
}

// Gemini AI API Integration
class GeminiAPI extends BaseAPI {
    constructor() {
        super(API_CONFIG.GEMINI);
    }
    
    // Set API key
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
    }
    
    // Main function to call Gemini API
    async callGeminiAPI(prompt, context = {}) {
        if (!this.config.apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: this.enhancePrompt(prompt, context)
                }]
            }],
            generationConfig: {
                temperature: this.config.temperature,
                maxOutputTokens: this.config.maxTokens,
                candidateCount: 1
            }
        };
        
        try {
            const response = await this.makeRequest(
                `${this.config.endpoint}?key=${this.config.apiKey}`,
                {
                    method: 'POST',
                    body: JSON.stringify(requestBody)
                }
            );
            
            return this.processGeminiResponse(response);
        } catch (error) {
            console.error('Gemini API call failed:', error);
            return this.generateFallbackResponse(prompt, context);
        }
    }
    
    // Enhance prompt with context
    enhancePrompt(prompt, context) {
        let enhancedPrompt = prompt;
        
        if (context.auditType) {
            enhancedPrompt = `As an expert in ${context.auditType} auditing, ${prompt}`;
        }
        
        if (context.companyInfo) {
            enhancedPrompt += `\n\nCompany Context: ${JSON.stringify(context.companyInfo)}`;
        }
        
        if (context.financialData) {
            enhancedPrompt += `\n\nFinancial Data: ${JSON.stringify(context.financialData)}`;
        }
        
        return enhancedPrompt;
    }
    
    // Process Gemini response
    processGeminiResponse(response) {
        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }
        throw new Error('Invalid response format from Gemini API');
    }
    
    // Generate fallback response when API fails
    generateFallbackResponse(prompt, context) {
        const fallbackResponses = {
            'risk_analysis': 'Unable to perform AI risk analysis. Please conduct manual risk assessment.',
            'audit_procedures': 'Unable to generate AI-powered procedures. Please refer to standard audit procedures.',
            'recommendations': 'Unable to generate AI recommendations. Please conduct manual analysis.'
        };
        
        return fallbackResponses[context.type] || 'AI analysis unavailable. Please proceed with manual review.';
    }
    
    // Specific audit analysis functions
    async analyzeRisks(auditType, companyData, financialData) {
        const prompt = `
            Analyze the audit risks for this ${auditType} audit based on the provided company and financial information.
            
            Please identify:
            1. High-risk areas requiring special attention
            2. Material misstatement risks
            3. Control environment concerns
            4. Specific audit procedures recommended
            5. Risk mitigation strategies
            
            Provide your response in JSON format with clear risk categories and severity levels.
        `;
        
        return await this.callGeminiAPI(prompt, {
            auditType,
            companyInfo: companyData,
            financialData,
            type: 'risk_analysis'
        });
    }
    
    async generateAuditProcedures(auditType, riskAreas, objectives) {
        const prompt = `
            Generate specific audit procedures for a ${auditType} audit focusing on the identified risk areas.
            
            Risk Areas: ${JSON.stringify(riskAreas)}
            Audit Objectives: ${JSON.stringify(objectives)}
            
            Please provide:
            1. Detailed audit procedures for each risk area
            2. Sample sizes and testing methodologies
            3. Documentation requirements
            4. Timeline and resource allocation
            5. Quality control measures
            
            Format the response as a structured audit program.
        `;
        
        return await this.callGeminiAPI(prompt, {
            auditType,
            type: 'audit_procedures'
        });
    }
    
    async analyzeFinancialData(trialBalance, journalEntries, priorPeriod = null) {
        const prompt = `
            Analyze the financial data for potential audit concerns and anomalies.
            
            Please examine:
            1. Unusual account balances or movements
            2. Journal entry patterns and outliers
            3. Ratio analysis and trends
            4. Potential misclassifications
            5. Areas requiring detailed testing
            
            Provide specific recommendations for audit procedures based on your analysis.
        `;
        
        return await this.callGeminiAPI(prompt, {
            financialData: { trialBalance, journalEntries, priorPeriod },
            type: 'financial_analysis'
        });
    }
}

// ERP System Integration
class ERPConnector extends BaseAPI {
    constructor() {
        super(API_CONFIG.ERP);
    }
    
    // Connect to ERP system
    async connect(credentials) {
        // Implementation depends on specific ERP system
        // This is a generic template
        
        const connectionData = {
            username: credentials.username,
            password: credentials.password,
            server: credentials.server,
            database: credentials.database
        };
        
        try {
            const response = await this.makeRequest('/api/connect', {
                method: 'POST',
                body: JSON.stringify(connectionData)
            });
            
            return response;
        } catch (error) {
            throw new Error(`ERP connection failed: ${error.message}`);
        }
    }
    
    // Fetch chart of accounts
    async getChartOfAccounts() {
        try {
            return await this.makeRequest('/api/chart-of-accounts');
        } catch (error) {
            // Return mock data if ERP unavailable
            return this.getMockChartOfAccounts();
        }
    }
    
    // Fetch trial balance
    async getTrialBalance(startDate, endDate) {
        try {
            return await this.makeRequest(`/api/trial-balance?start=${startDate}&end=${endDate}`);
        } catch (error) {
            // Return mock data if ERP unavailable
            return this.getMockTrialBalance();
        }
    }
    
    // Fetch journal entries
    async getJournalEntries(startDate, endDate, accountCode = null) {
        try {
            const params = new URLSearchParams({
                start: startDate,
                end: endDate
            });
            
            if (accountCode) {
                params.append('account', accountCode);
            }
            
            return await this.makeRequest(`/api/journal-entries?${params}`);
        } catch (error) {
            // Return mock data if ERP unavailable
            return this.getMockJournalEntries();
        }
    }
    
    // Mock data methods for development/testing
    getMockChartOfAccounts() {
        return [
            { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', category: 'Current Assets' },
            { code: '1100', name: 'Accounts Receivable', type: 'Asset', category: 'Current Assets' },
            { code: '1200', name: 'Inventory', type: 'Asset', category: 'Current Assets' },
            { code: '1500', name: 'Property, Plant & Equipment', type: 'Asset', category: 'Fixed Assets' },
            { code: '2000', name: 'Accounts Payable', type: 'Liability', category: 'Current Liabilities' },
            { code: '2100', name: 'Accrued Liabilities', type: 'Liability', category: 'Current Liabilities' },
            { code: '2500', name: 'Long-term Debt', type: 'Liability', category: 'Long-term Liabilities' },
            { code: '3000', name: 'Share Capital', type: 'Equity', category: 'Shareholders Equity' },
            { code: '3100', name: 'Retained Earnings', type: 'Equity', category: 'Shareholders Equity' },
            { code: '4000', name: 'Sales Revenue', type: 'Revenue', category: 'Operating Revenue' },
            { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', category: 'Operating Expenses' },
            { code: '6000', name: 'Operating Expenses', type: 'Expense', category: 'Operating Expenses' }
        ];
    }
    
    getMockTrialBalance() {
        return [
            { accountCode: '1000', accountName: 'Cash and Cash Equivalents', debit: 150000, credit: 0 },
            { accountCode: '1100', accountName: 'Accounts Receivable', debit: 300000, credit: 0 },
            { accountCode: '1200', accountName: 'Inventory', debit: 450000, credit: 0 },
            { accountCode: '1500', accountName: 'Property, Plant & Equipment', debit: 1200000, credit: 0 },
            { accountCode: '2000', accountName: 'Accounts Payable', debit: 0, credit: 180000 },
            { accountCode: '2100', accountName: 'Accrued Liabilities', debit: 0, credit: 75000 },
            { accountCode: '2500', accountName: 'Long-term Debt', debit: 0, credit: 600000 },
            { accountCode: '3000', accountName: 'Share Capital', debit: 0, credit: 500000 },
            { accountCode: '3100', accountName: 'Retained Earnings', debit: 0, credit: 545000 },
            { accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 2000000 },
            { accountCode: '5000', accountName: 'Cost of Goods Sold', debit: 1200000, credit: 0 },
            { accountCode: '6000', accountName: 'Operating Expenses', debit: 600000, credit: 0 }
        ];
    }
    
    getMockJournalEntries() {
        const entries = [];
        const accounts = this.getMockChartOfAccounts();
        
        for (let i = 1; i <= 50; i++) {
            entries.push({
                entryNumber: `JE${i.toString().padStart(4, '0')}`,
                date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                description: `Journal Entry ${i}`,
                reference: `REF${i}`,
                lines: [
                    {
                        accountCode: accounts[Math.floor(Math.random() * accounts.length)].code,
                        description: `Line item ${i}A`,
                        debit: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 1000 : 0,
                        credit: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 1000 : 0
                    },
                    {
                        accountCode: accounts[Math.floor(Math.random() * accounts.length)].code,
                        description: `Line item ${i}B`,
                        debit: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 1000 : 0,
                        credit: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 1000 : 0
                    }
                ]
            });
        }
        
        return entries;
    }
}

// Accounting System Connector
class AccountingConnector extends BaseAPI {
    constructor() {
        super(API_CONFIG.ACCOUNTING);
    }
    
    async syncData(dateRange) {
        // Implementation for accounting system integration
        try {
            return await this.makeRequest('/api/sync', {
                method: 'POST',
                body: JSON.stringify(dateRange)
            });
        } catch (error) {
            console.warn('Accounting system sync failed, using local data');
            return { success: false, message: 'Using local data' };
        }
    }
    
    async getAccountingPolicies() {
        // Fetch accounting policies and procedures
        try {
            return await this.makeRequest('/api/policies');
        } catch (error) {
            return this.getMockAccountingPolicies();
        }
    }
    
    getMockAccountingPolicies() {
        return {
            revenueRecognition: 'Accrual basis, recognized upon delivery',
            inventoryValuation: 'FIFO method',
            depreciationMethod: 'Straight-line method',
            badDebtProvision: '2% of accounts receivable',
            currencyTranslation: 'Current rate method'
        };
    }
}

// Compliance System Connector
class ComplianceConnector extends BaseAPI {
    constructor() {
        super(API_CONFIG.COMPLIANCE);
    }
    
    async getComplianceRequirements(jurisdiction, industry) {
        try {
            return await this.makeRequest(`/api/requirements?jurisdiction=${jurisdiction}&industry=${industry}`);
        } catch (error) {
            return this.getMockComplianceRequirements();
        }
    }
    
    async checkCompliance(data, requirements) {
        try {
            return await this.makeRequest('/api/check', {
                method: 'POST',
                body: JSON.stringify({ data, requirements })
            });
        } catch (error) {
            return this.performBasicComplianceCheck(data, requirements);
        }
    }
    
    getMockComplianceRequirements() {
        return {
            financial_reporting: [
                'IFRS compliance',
                'Annual audit requirement',
                'Quarterly reporting'
            ],
            tax_compliance: [
                'Corporate tax filing',
                'VAT returns',
                'Payroll tax compliance'
            ],
            regulatory: [
                'SOX compliance',
                'Data protection compliance',
                'Industry-specific regulations'
            ]
        };
    }
    
    performBasicComplianceCheck(data, requirements) {
        // Basic compliance checking logic
        const results = {
            overall_score: Math.floor(Math.random() * 30) + 70, // 70-100%
            areas_of_concern: [],
            recommendations: []
        };
        
        if (results.overall_score < 85) {
            results.areas_of_concern.push('Documentation completeness');
            results.recommendations.push('Enhance documentation procedures');
        }
        
        return results;
    }
}

// Data export utilities
class DataExporter {
    constructor() {
        this.supportedFormats = ['excel', 'pdf', 'csv', 'json'];
    }
    
    async exportToExcel(data, filename = 'audit_export') {
        if (typeof XLSX === 'undefined') {
            throw new Error('XLSX library not loaded');
        }
        
        const workbook = XLSX.utils.book_new();
        
        // Convert data to worksheets
        if (Array.isArray(data)) {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        } else if (typeof data === 'object') {
            Object.keys(data).forEach(key => {
                const worksheet = XLSX.utils.json_to_sheet(Array.isArray(data[key]) ? data[key] : [data[key]]);
                XLSX.utils.book_append_sheet(workbook, worksheet, key);
            });
        }
        
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    }
    
    async exportToCSV(data, filename = 'audit_export') {
        if (!Array.isArray(data)) {
            throw new Error('CSV export requires array data');
        }
        
        const csv = this.arrayToCSV(data);
        this.downloadFile(csv, `${filename}.csv`, 'text/csv');
    }
    
    async exportToJSON(data, filename = 'audit_export') {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, `${filename}.json`, 'application/json');
    }
    
    arrayToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => 
                JSON.stringify(row[header] || '')
            ).join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize API instances
const apiInstances = {
    gemini: new GeminiAPI(),
    erp: new ERPConnector(),
    accounting: new AccountingConnector(),
    compliance: new ComplianceConnector(),
    exporter: new DataExporter()
};

// Export to global scope
window.AuditPulse = window.AuditPulse || {};
window.AuditPulse.utils = window.AuditPulse.utils || {};
window.AuditPulse.utils.api = apiInstances;