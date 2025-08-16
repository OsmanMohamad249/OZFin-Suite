// AuditPulse Calculations Utility
// Handles financial calculations, risk scoring, and data processing

// Financial Calculations Class
class FinancialCalculations {
    constructor() {
        this.precision = 2; // Decimal places for rounding
    }
    
    // Process journal entries to create trial balance
    processJournalEntriesToTrialBalance(journalEntries) {
        const accounts = new Map();
        
        journalEntries.forEach(entry => {
            entry.lines.forEach(line => {
                if (!accounts.has(line.accountCode)) {
                    accounts.set(line.accountCode, {
                        accountCode: line.accountCode,
                        accountName: line.accountName || line.accountCode,
                        debit: 0,
                        credit: 0,
                        balance: 0
                    });
                }
                
                const account = accounts.get(line.accountCode);
                account.debit += line.debit || 0;
                account.credit += line.credit || 0;
                account.balance = account.debit - account.credit;
            });
        });
        
        return Array.from(accounts.values()).sort((a, b) => 
            a.accountCode.localeCompare(b.accountCode)
        );
    }
    
    // Calculate financial statement figures from trial balance
    calculateFinancialStatements(trialBalance, chartOfAccounts) {
        const statements = {
            balanceSheet: {
                assets: {
                    current: 0,
                    nonCurrent: 0,
                    total: 0
                },
                liabilities: {
                    current: 0,
                    nonCurrent: 0,
                    total: 0
                },
                equity: {
                    total: 0
                }
            },
            incomeStatement: {
                revenue: 0,
                expenses: 0,
                grossProfit: 0,
                operatingIncome: 0,
                netIncome: 0
            },
            cashFlowStatement: {
                operating: 0,
                investing: 0,
                financing: 0,
                netCashFlow: 0
            }
        };
        
        const accountMap = this.createAccountMap(chartOfAccounts);
        
        trialBalance.forEach(account => {
            const accountInfo = accountMap.get(account.accountCode);
            if (!accountInfo) return;
            
            const balance = account.balance || (account.debit - account.credit);
            
            switch (accountInfo.type.toLowerCase()) {
                case 'asset':
                    if (accountInfo.category && accountInfo.category.toLowerCase().includes('current')) {
                        statements.balanceSheet.assets.current += balance;
                    } else {
                        statements.balanceSheet.assets.nonCurrent += balance;
                    }
                    break;
                
                case 'liability':
                    if (accountInfo.category && accountInfo.category.toLowerCase().includes('current')) {
                        statements.balanceSheet.liabilities.current += Math.abs(balance);
                    } else {
                        statements.balanceSheet.liabilities.nonCurrent += Math.abs(balance);
                    }
                    break;
                
                case 'equity':
                    statements.balanceSheet.equity.total += Math.abs(balance);
                    break;
                
                case 'revenue':
                    statements.incomeStatement.revenue += Math.abs(balance);
                    break;
                
                case 'expense':
                    statements.incomeStatement.expenses += balance;
                    break;
            }
        });
        
        // Calculate totals and derived figures
        statements.balanceSheet.assets.total = 
            statements.balanceSheet.assets.current + statements.balanceSheet.assets.nonCurrent;
        
        statements.balanceSheet.liabilities.total = 
            statements.balanceSheet.liabilities.current + statements.balanceSheet.liabilities.nonCurrent;
        
        statements.incomeStatement.grossProfit = 
            statements.incomeStatement.revenue - this.getCostOfGoodsSold(trialBalance, accountMap);
        
        statements.incomeStatement.operatingIncome = 
            statements.incomeStatement.grossProfit - this.getOperatingExpenses(trialBalance, accountMap);
        
        statements.incomeStatement.netIncome = 
            statements.incomeStatement.revenue - statements.incomeStatement.expenses;
        
        // Round all values
        this.roundStatements(statements);
        
        return statements;
    }
    
    // Create account mapping for easier lookup
    createAccountMap(chartOfAccounts) {
        const map = new Map();
        chartOfAccounts.forEach(account => {
            map.set(account.code, account);
        });
        return map;
    }
    
    // Get cost of goods sold from trial balance
    getCostOfGoodsSold(trialBalance, accountMap) {
        return trialBalance
            .filter(account => {
                const info = accountMap.get(account.accountCode);
                return info && info.name.toLowerCase().includes('cost of goods');
            })
            .reduce((sum, account) => sum + (account.balance || (account.debit - account.credit)), 0);
    }
    
    // Get operating expenses from trial balance
    getOperatingExpenses(trialBalance, accountMap) {
        return trialBalance
            .filter(account => {
                const info = accountMap.get(account.accountCode);
                return info && info.type.toLowerCase() === 'expense' && 
                       !info.name.toLowerCase().includes('cost of goods');
            })
            .reduce((sum, account) => sum + (account.balance || (account.debit - account.credit)), 0);
    }
    
    // Round all statement values
    roundStatements(statements) {
        const roundObject = (obj) => {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'number') {
                    obj[key] = this.round(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    roundObject(obj[key]);
                }
            });
        };
        
        roundObject(statements);
    }
    
    // Financial ratio calculations
    calculateFinancialRatios(statements) {
        const ratios = {
            liquidity: {},
            profitability: {},
            leverage: {},
            efficiency: {}
        };
        
        const bs = statements.balanceSheet;
        const is = statements.incomeStatement;
        
        // Liquidity ratios
        ratios.liquidity.currentRatio = this.divide(bs.assets.current, bs.liabilities.current);
        ratios.liquidity.quickRatio = this.divide(
            bs.assets.current - this.getInventoryValue(statements), 
            bs.liabilities.current
        );
        
        // Profitability ratios
        ratios.profitability.grossProfitMargin = this.divide(is.grossProfit, is.revenue) * 100;
        ratios.profitability.netProfitMargin = this.divide(is.netIncome, is.revenue) * 100;
        ratios.profitability.returnOnAssets = this.divide(is.netIncome, bs.assets.total) * 100;
        ratios.profitability.returnOnEquity = this.divide(is.netIncome, bs.equity.total) * 100;
        
        // Leverage ratios
        ratios.leverage.debtToAssets = this.divide(bs.liabilities.total, bs.assets.total) * 100;
        ratios.leverage.debtToEquity = this.divide(bs.liabilities.total, bs.equity.total) * 100;
        
        // Round all ratios
        this.roundRatios(ratios);
        
        return ratios;
    }
    
    // Get inventory value (simplified - would need more sophisticated logic in real implementation)
    getInventoryValue(statements) {
        // This would typically require more detailed account analysis
        return statements.balanceSheet.assets.current * 0.3; // Approximation
    }
    
    // Round ratio values
    roundRatios(ratios) {
        const roundObject = (obj) => {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'number') {
                    obj[key] = this.round(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    roundObject(obj[key]);
                }
            });
        };
        
        roundObject(ratios);
    }
    
    // Safe division to avoid divide by zero
    divide(numerator, denominator) {
        if (denominator === 0) return 0;
        return numerator / denominator;
    }
    
    // Round to specified precision
    round(value) {
        return Math.round(value * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    }
    
    // Calculate materiality threshold
    calculateMateriality(financialStatements, materialityBasis = 'netIncome') {
        let baseAmount = 0;
        
        switch (materialityBasis) {
            case 'netIncome':
                baseAmount = Math.abs(financialStatements.incomeStatement.netIncome);
                return baseAmount * 0.05; // 5% of net income
            
            case 'revenue':
                baseAmount = financialStatements.incomeStatement.revenue;
                return baseAmount * 0.005; // 0.5% of revenue
            
            case 'totalAssets':
                baseAmount = financialStatements.balanceSheet.assets.total;
                return baseAmount * 0.005; // 0.5% of total assets
            
            default:
                baseAmount = Math.abs(financialStatements.incomeStatement.netIncome);
                return baseAmount * 0.05;
        }
    }
    
    // Perform trend analysis
    performTrendAnalysis(currentPeriod, priorPeriods) {
        const trends = {
            revenue: [],
            expenses: [],
            netIncome: [],
            assets: [],
            liabilities: [],
            equity: []
        };
        
        // Calculate percentage changes
        priorPeriods.forEach((period, index) => {
            const prevPeriod = index === 0 ? currentPeriod : priorPeriods[index - 1];
            
            trends.revenue.push(this.calculateGrowthRate(period.incomeStatement.revenue, prevPeriod.incomeStatement.revenue));
            trends.expenses.push(this.calculateGrowthRate(period.incomeStatement.expenses, prevPeriod.incomeStatement.expenses));
            trends.netIncome.push(this.calculateGrowthRate(period.incomeStatement.netIncome, prevPeriod.incomeStatement.netIncome));
            trends.assets.push(this.calculateGrowthRate(period.balanceSheet.assets.total, prevPeriod.balanceSheet.assets.total));
            trends.liabilities.push(this.calculateGrowthRate(period.balanceSheet.liabilities.total, prevPeriod.balanceSheet.liabilities.total));
            trends.equity.push(this.calculateGrowthRate(period.balanceSheet.equity.total, prevPeriod.balanceSheet.equity.total));
        });
        
        return trends;
    }
    
    // Calculate growth rate between periods
    calculateGrowthRate(current, prior) {
        if (prior === 0) return current > 0 ? 100 : 0;
        return ((current - prior) / Math.abs(prior)) * 100;
    }
}

// Risk Assessment and Scoring
class RiskAssessment {
    constructor() {
        this.riskFactors = {
            financial: {
                profitabilityDecline: { weight: 0.2, threshold: -10 },
                liquidityIssues: { weight: 0.25, threshold: 1.2 },
                leverageHigh: { weight: 0.2, threshold: 60 },
                revenueVolatility: { weight: 0.15, threshold: 15 },
                materialWeaknesses: { weight: 0.2, threshold: 1 }
            },
            operational: {
                processEfficiency: { weight: 0.3, threshold: 80 },
                controlDeficiencies: { weight: 0.25, threshold: 2 },
                complianceIssues: { weight: 0.25, threshold: 1 },
                systemReliability: { weight: 0.2, threshold: 95 }
            },
            compliance: {
                regulatoryViolations: { weight: 0.3, threshold: 0 },
                policyAdherence: { weight: 0.25, threshold: 90 },
                documentationGaps: { weight: 0.2, threshold: 5 },
                trainingCompliance: { weight: 0.25, threshold: 95 }
            }
        };
    }
    
    // Calculate overall risk score
    calculateRiskScore(auditType, data) {
        const factors = this.riskFactors[auditType] || this.riskFactors.financial;
        let totalScore = 0;
        let totalWeight = 0;
        
        Object.keys(factors).forEach(factorName => {
            const factor = factors[factorName];
            const score = this.assessRiskFactor(factorName, data[factorName], factor);
            totalScore += score * factor.weight;
            totalWeight += factor.weight;
        });
        
        return Math.round((totalScore / totalWeight) * 100) / 100;
    }
    
    // Assess individual risk factor
    assessRiskFactor(factorName, value, factor) {
        if (value === undefined || value === null) return 50; // Neutral score if no data
        
        // Risk scoring logic based on factor type and threshold
        switch (factorName) {
            case 'profitabilityDecline':
                return value < factor.threshold ? 80 : 20;
            
            case 'liquidityIssues':
                return value < factor.threshold ? 80 : 20;
            
            case 'leverageHigh':
                return value > factor.threshold ? 80 : 20;
            
            case 'revenueVolatility':
                return Math.abs(value) > factor.threshold ? 70 : 30;
            
            default:
                // Generic scoring for other factors
                return this.genericRiskScore(value, factor.threshold);
        }
    }
    
    // Generic risk scoring method
    genericRiskScore(value, threshold) {
        const deviation = Math.abs(value - threshold) / threshold;
        return Math.min(100, 20 + (deviation * 60));
    }
    
    // Identify high-risk areas based on financial data
    identifyHighRiskAreas(financialStatements, ratios, priorPeriod = null) {
        const riskAreas = [];
        
        // Revenue recognition risks
        if (priorPeriod) {
            const revenueGrowth = this.calculateGrowthRate(
                financialStatements.incomeStatement.revenue,
                priorPeriod.incomeStatement.revenue
            );
            
            if (Math.abs(revenueGrowth) > 25) {
                riskAreas.push({
                    area: 'Revenue Recognition',
                    risk: 'high',
                    reason: `Unusual revenue growth of ${revenueGrowth.toFixed(1)}%`,
                    procedures: ['Detailed revenue testing', 'Cut-off testing', 'Related party transactions review']
                });
            }
        }
        
        // Liquidity risks
        if (ratios.liquidity.currentRatio < 1.0) {
            riskAreas.push({
                area: 'Going Concern',
                risk: 'high',
                reason: `Low current ratio: ${ratios.liquidity.currentRatio}`,
                procedures: ['Cash flow analysis', 'Debt covenant testing', 'Management inquiry']
            });
        }
        
        // Inventory risks (if significant)
        const inventoryRatio = financialStatements.balanceSheet.assets.current * 0.3; // Approximation
        if (inventoryRatio > financialStatements.balanceSheet.assets.total * 0.2) {
            riskAreas.push({
                area: 'Inventory Valuation',
                risk: 'medium',
                reason: 'Inventory represents significant portion of assets',
                procedures: ['Physical inventory observation', 'NRV testing', 'Obsolescence review']
            });
        }
        
        // Related party transactions (placeholder)
        riskAreas.push({
            area: 'Related Party Transactions',
            risk: 'medium',
            reason: 'Standard risk area requiring attention',
            procedures: ['Related party identification', 'Transaction testing', 'Disclosure review']
        });
        
        return riskAreas.sort((a, b) => this.getRiskPriority(b.risk) - this.getRiskPriority(a.risk));
    }
    
    // Get risk priority for sorting
    getRiskPriority(riskLevel) {
        const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorities[riskLevel] || 0;
    }
    
    // Calculate growth rate helper
    calculateGrowthRate(current, prior) {
        if (prior === 0) return current > 0 ? 100 : 0;
        return ((current - prior) / Math.abs(prior)) * 100;
    }
}

// Audit Sampling Calculations
class AuditSampling {
    constructor() {
        this.confidenceLevels = {
            90: 1.64,
            95: 1.96,
            99: 2.58
        };
        
        this.reliabilityFactors = {
            low: 1.0,
            medium: 2.3,
            high: 3.0
        };
    }
    
    // Calculate sample size for substantive testing
    calculateSampleSize(populationSize, materialityThreshold, expectedError = 0, confidenceLevel = 95) {
        const zScore = this.confidenceLevels[confidenceLevel] || 1.96;
        const precision = materialityThreshold * 0.1; // 10% of materiality
        
        // Formula: n = (Z^2 * σ^2) / E^2
        // Where σ is estimated standard deviation and E is precision
        const variance = Math.max(materialityThreshold * 0.5, expectedError * 1.5);
        const sampleSize = Math.ceil((Math.pow(zScore, 2) * Math.pow(variance, 2)) / Math.pow(precision, 2));
        
        // Finite population correction
        const adjustedSampleSize = Math.ceil(sampleSize / (1 + (sampleSize / populationSize)));
        
        return Math.min(adjustedSampleSize, populationSize);
    }
    
    // Calculate sample size for controls testing
    calculateControlsSampleSize(populationSize, reliance = 'medium', deviationRate = 0.05) {
        const reliabilityFactor = this.reliabilityFactors[reliance] || 2.3;
        const sampleSize = Math.ceil(reliabilityFactor / deviationRate);
        
        return Math.min(sampleSize, populationSize);
    }
    
    // Select random sample from population
    selectRandomSample(population, sampleSize) {
        if (sampleSize >= population.length) return [...population];
        
        const selected = new Set();
        const sample = [];
        
        while (sample.length < sampleSize) {
            const randomIndex = Math.floor(Math.random() * population.length);
            if (!selected.has(randomIndex)) {
                selected.add(randomIndex);
                sample.push(population[randomIndex]);
            }
        }
        
        return sample;
    }
    
    // Systematic sampling
    selectSystematicSample(population, sampleSize) {
        if (sampleSize >= population.length) return [...population];
        
        const interval = Math.floor(population.length / sampleSize);
        const startPoint = Math.floor(Math.random() * interval);
        const sample = [];
        
        for (let i = 0; i < sampleSize; i++) {
            const index = (startPoint + (i * interval)) % population.length;
            sample.push(population[index]);
        }
        
        return sample;
    }
}

// Data Validation and Cleansing
class DataValidation {
    constructor() {
        this.validationRules = {
            trialBalance: [
                { field: 'accountCode', required: true, pattern: /^[A-Z0-9]{3,10}$/ },
                { field: 'accountName', required: true, minLength: 3 },
                { field: 'debit', type: 'number', min: 0 },
                { field: 'credit', type: 'number', min: 0 }
            ],
            journalEntry: [
                { field: 'entryNumber', required: true, pattern: /^[A-Z0-9]+$/ },
                { field: 'date', required: true, type: 'date' },
                { field: 'description', required: true, minLength: 5 },
                { field: 'lines', required: true, type: 'array', minLength: 2 }
            ]
        };
    }
    
    // Validate data against rules
    validateData(data, dataType) {
        const rules = this.validationRules[dataType];
        if (!rules) return { valid: true, errors: [] };
        
        const errors = [];
        
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                const itemErrors = this.validateItem(item, rules, index);
                errors.push(...itemErrors);
            });
        } else {
            const itemErrors = this.validateItem(data, rules);
            errors.push(...itemErrors);
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    // Validate individual item
    validateItem(item, rules, index = null) {
        const errors = [];
        const prefix = index !== null ? `Row ${index + 1}: ` : '';
        
        rules.forEach(rule => {
            const value = item[rule.field];
            
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${prefix}${rule.field} is required`);
                return;
            }
            
            if (value === undefined || value === null || value === '') return;
            
            if (rule.type === 'number' && isNaN(Number(value))) {
                errors.push(`${prefix}${rule.field} must be a number`);
            }
            
            if (rule.type === 'date' && !this.isValidDate(value)) {
                errors.push(`${prefix}${rule.field} must be a valid date`);
            }
            
            if (rule.type === 'array' && !Array.isArray(value)) {
                errors.push(`${prefix}${rule.field} must be an array`);
            }
            
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(`${prefix}${rule.field} format is invalid`);
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(`${prefix}${rule.field} must be at least ${rule.minLength} characters`);
            }
            
            if (rule.min !== undefined && Number(value) < rule.min) {
                errors.push(`${prefix}${rule.field} must be at least ${rule.min}`);
            }
        });
        
        return errors;
    }
    
    // Check if date is valid
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }
    
    // Clean and normalize data
    cleanData(data, dataType) {
        if (Array.isArray(data)) {
            return data.map(item => this.cleanItem(item, dataType));
        } else {
            return this.cleanItem(data, dataType);
        }
    }
    
    // Clean individual item
    cleanItem(item, dataType) {
        const cleaned = { ...item };
        
        // Convert strings to numbers where appropriate
        if (dataType === 'trialBalance') {
            ['debit', 'credit', 'balance'].forEach(field => {
                if (cleaned[field] && typeof cleaned[field] === 'string') {
                    cleaned[field] = Number(cleaned[field]) || 0;
                }
            });
        }
        
        // Trim string fields
        Object.keys(cleaned).forEach(key => {
            if (typeof cleaned[key] === 'string') {
                cleaned[key] = cleaned[key].trim();
            }
        });
        
        return cleaned;
    }
}

// Export calculation classes
const calculationInstances = {
    financial: new FinancialCalculations(),
    risk: new RiskAssessment(),
    sampling: new AuditSampling(),
    validation: new DataValidation()
};

// Export to global scope
window.AuditPulse = window.AuditPulse || {};
window.AuditPulse.utils = window.AuditPulse.utils || {};
window.AuditPulse.utils.calculations = calculationInstances;