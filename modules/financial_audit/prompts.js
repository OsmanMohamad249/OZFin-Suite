// Financial Audit AI Prompts
// Specialized prompts for Gemini API integration in financial auditing

class FinancialAuditPrompts {
    constructor() {
        this.baseContext = `
            You are a senior financial auditor with expertise in IFRS, GAAP, and audit methodologies.
            Your role is to provide professional, accurate, and practical audit guidance.
            Always consider materiality, risk assessment, and audit efficiency in your recommendations.
        `;
    }
    
    // Risk assessment prompts
    getRiskAssessmentPrompt(companyData, financialData, industryContext) {
        return `${this.baseContext}
        
        TASK: Perform a comprehensive risk assessment for a financial statement audit.
        
        COMPANY INFORMATION:
        ${JSON.stringify(companyData, null, 2)}
        
        FINANCIAL DATA:
        ${JSON.stringify(financialData, null, 2)}
        
        INDUSTRY CONTEXT:
        ${industryContext}
        
        Please analyze and provide:
        
        1. OVERALL RISK ASSESSMENT:
           - Risk level (Low/Medium/High) with explanation
           - Key risk factors identified
           - Risk rating scale 1-100
        
        2. SPECIFIC RISK AREAS:
           For each significant account/area, assess:
           - Inherent risk level
           - Control risk level
           - Detection risk required
           - Specific risk factors
        
        3. FRAUD RISK ASSESSMENT:
           - Revenue recognition manipulation risks
           - Asset misappropriation risks
           - Management override possibilities
           - Fraud triangle factors present
        
        4. MATERIALITY CONSIDERATIONS:
           - Recommended materiality basis
           - Performance materiality suggestions
           - Clearly trivial threshold
        
        5. AUDIT STRATEGY IMPLICATIONS:
           - Substantive vs. controls testing approach
           - Timing of audit procedures
           - Staffing considerations
           - Specialist involvement needs
        
        Format your response in clear sections with specific recommendations for audit procedures.
        Focus on actionable insights that will guide the audit team's approach.`;
    }
    
    // Analytical procedures prompts
    getAnalyticalProceduresPrompt(currentPeriod, priorPeriod, budgetData, industryBenchmarks) {
        return `${this.baseContext}
        
        TASK: Perform analytical procedures on financial data to identify unusual fluctuations and potential audit areas.
        
        CURRENT PERIOD DATA:
        ${JSON.stringify(currentPeriod, null, 2)}
        
        PRIOR PERIOD DATA:
        ${JSON.stringify(priorPeriod, null, 2)}
        
        BUDGET/FORECAST DATA:
        ${JSON.stringify(budgetData, null, 2)}
        
        INDUSTRY BENCHMARKS:
        ${JSON.stringify(industryBenchmarks, null, 2)}
        
        Please perform the following analytical procedures:
        
        1. TREND ANALYSIS:
           - Revenue trends and growth rates
           - Expense fluctuations and ratios
           - Balance sheet changes
           - Cash flow patterns
        
        2. RATIO ANALYSIS:
           - Liquidity ratios and changes
           - Profitability ratios and trends
           - Efficiency ratios
           - Leverage ratios
        
        3. REASONABLENESS TESTS:
           - Revenue vs. expense relationships
           - Balance sheet account relationships
           - Industry benchmark comparisons
           - Budget vs. actual variances
        
        4. UNUSUAL FLUCTUATIONS:
           - Significant variances (>materiality threshold)
           - Unexpected relationships
           - Industry deviation analysis
           - Month-to-month irregularities
        
        5. AUDIT FOCUS AREAS:
           - Accounts requiring detailed testing
           - Specific audit procedures recommended
           - Sample size suggestions
           - Timing of procedures
        
        Provide specific dollar amounts, percentages, and clear explanations for all identified variances.
        Prioritize findings by audit significance and risk level.`;
    }
    
    // Audit procedures generation prompt
    getAuditProceduresPrompt(riskAreas, materialityThreshold, auditObjectives, clientSpecifics) {
        return `${this.baseContext}
        
        TASK: Develop detailed audit procedures for identified risk areas.
        
        IDENTIFIED RISK AREAS:
        ${JSON.stringify(riskAreas, null, 2)}
        
        MATERIALITY THRESHOLD: $${materialityThreshold}
        
        AUDIT OBJECTIVES:
        ${JSON.stringify(auditObjectives, null, 2)}
        
        CLIENT SPECIFICS:
        ${JSON.stringify(clientSpecifics, null, 2)}
        
        For each risk area, develop:
        
        1. SUBSTANTIVE PROCEDURES:
           - Specific testing procedures
           - Sample selection methodology
           - Sample sizes and selection criteria
           - Documentation requirements
           - Expected evidence types
        
        2. CONTROLS TESTING (if applicable):
           - Key controls identification
           - Testing procedures for controls
           - Sample sizes for controls testing
           - Deficiency evaluation criteria
        
        3. ASSERTION-SPECIFIC PROCEDURES:
           - Existence/Occurrence procedures
           - Completeness procedures  
           - Valuation/Accuracy procedures
           - Rights and Obligations procedures
           - Presentation/Disclosure procedures
        
        4. TIMING AND LOGISTICS:
           - Interim vs. year-end procedures
           - Client preparation requirements
           - Team member skill requirements
           - Estimated time requirements
        
        5. POTENTIAL FINDINGS:
           - Common misstatements expected
           - Red flags to watch for
           - Follow-up procedures if exceptions found
           - Evaluation criteria for results
        
        Focus on practical, efficient procedures that address the specific risks identified.
        Include both traditional and technology-assisted audit techniques where appropriate.`;
    }
    
    // Journal entry testing prompts
    getJournalEntryTestingPrompt(journalEntries, riskCriteria, materialityThreshold) {
        return `${this.baseContext}
        
        TASK: Analyze journal entries for potential fraud indicators and unusual transactions.
        
        JOURNAL ENTRIES DATA:
        ${JSON.stringify(journalEntries.slice(0, 100), null, 2)} // Limited to first 100 for prompt size
        
        RISK CRITERIA:
        ${JSON.stringify(riskCriteria, null, 2)}
        
        MATERIALITY THRESHOLD: $${materialityThreshold}
        
        Please analyze and identify:
        
        1. HIGH-RISK JOURNAL ENTRIES:
           - Entries made by management
           - Entries posted after normal business hours
           - Entries posted on weekends/holidays
           - Entries posted near period end
           - Round-number entries
           - Entries without proper documentation
        
        2. UNUSUAL PATTERNS:
           - Frequent reversing entries
           - Entries to unrelated accounts
           - Complex or unusual account combinations
           - Entries just below materiality threshold
           - Repetitive entry patterns
        
        3. FRAUD INDICATORS:
           - Revenue manipulation attempts
           - Expense shifting or hiding
           - Asset overstatement techniques
           - Liability understatement methods
           - Earnings management indicators
        
        4. TESTING RECOMMENDATIONS:
           - Specific entries requiring detailed testing
           - Documentation to request from client
           - Additional procedures to perform
           - Sample size recommendations
        
        5. RED FLAGS SUMMARY:
           - Immediate attention items
           - Management inquiry areas
           - Potential control deficiencies
           - Suggested follow-up procedures
        
        Rank your findings by risk level and provide specific entry references where possible.
        Include practical guidance for audit team follow-up actions.`;
    }
    
    // Revenue recognition analysis prompt
    getRevenueAnalysisPrompt(revenueData, contracts, policies, industryPractices) {
        return `${this.baseContext}
        
        TASK: Analyze revenue recognition practices for compliance with accounting standards and identify audit risks.
        
        REVENUE DATA:
        ${JSON.stringify(revenueData, null, 2)}
        
        REVENUE CONTRACTS:
        ${JSON.stringify(contracts, null, 2)}
        
        ACCOUNTING POLICIES:
        ${JSON.stringify(policies, null, 2)}
        
        INDUSTRY PRACTICES:
        ${JSON.stringify(industryPractices, null, 2)}
        
        Please evaluate:
        
        1. REVENUE RECOGNITION COMPLIANCE:
           - Adherence to IFRS 15/ASC 606
           - Contract identification accuracy
           - Performance obligation assessment
           - Transaction price allocation
           - Revenue timing appropriateness
        
        2. RISK AREAS IDENTIFICATION:
           - Complex contract structures
           - Variable consideration elements
           - Multi-element arrangements
           - Long-term contract accounting
           - Channel stuffing indicators
        
        3. CUT-OFF ANALYSIS:
           - Period-end revenue transactions
           - Shipping and delivery terms
           - Bill-and-hold arrangements
           - Service revenue recognition
           - Consignment arrangements
        
        4. ANALYTICAL PROCEDURES:
           - Revenue trend analysis
           - Seasonal variation patterns
           - Customer concentration risks
           - Margin analysis by product/service
           - Days sales outstanding trends
        
        5. AUDIT PROCEDURES RECOMMENDATIONS:
           - Specific testing procedures
           - Contract review requirements
           - Confirmation procedures
           - Cut-off testing methodology
           - Analytical procedure expectations
        
        Focus on practical audit steps that can effectively test revenue recognition accuracy.
        Highlight areas requiring specialized skills or external confirmations.`;
    }
    
    // Going concern assessment prompt
    getGoingConcernPrompt(financialData, cashFlows, debtInfo, businessFactors) {
        return `${this.baseContext}
        
        TASK: Assess going concern assumptions and identify potential substantial doubt indicators.
        
        FINANCIAL DATA:
        ${JSON.stringify(financialData, null, 2)}
        
        CASH FLOW INFORMATION:
        ${JSON.stringify(cashFlows, null, 2)}
        
        DEBT INFORMATION:
        ${JSON.stringify(debtInfo, null, 2)}
        
        BUSINESS FACTORS:
        ${JSON.stringify(businessFactors, null, 2)}
        
        Evaluate the following:
        
        1. FINANCIAL INDICATORS:
           - Liquidity position and trends
           - Debt covenant compliance
           - Cash flow adequacy
           - Operating losses and trends
           - Working capital deficiencies
        
        2. OPERATIONAL INDICATORS:
           - Loss of key customers/suppliers
           - Labor difficulties or shortages
           - Obsolescence of key products
           - Regulatory or legal proceedings
           - Technology disruption impacts
        
        3. OTHER INDICATORS:
           - Management turnover
           - Financing difficulties
           - Supplier credit terms changes
           - Customer payment delays
           - Insurance coverage issues
        
        4. MITIGATING FACTORS:
           - Management plans evaluation
           - Available financing sources
           - Asset liquidation possibilities
           - Cost reduction opportunities
           - Revenue enhancement plans
        
        5. AUDIT CONCLUSIONS:
           - Going concern risk assessment
           - Substantial doubt determination
           - Additional audit procedures needed
           - Management inquiry areas
           - Disclosure requirements evaluation
        
        Provide a clear conclusion on whether substantial doubt exists about the entity's ability to continue as a going concern.
        Include specific audit procedures to address identified concerns.`;
    }
    
    // Internal controls assessment prompt
    getControlsAssessmentPrompt(controlEnvironment, controlActivities, riskAssessment, informationSystems) {
        return `${this.baseContext}
        
        TASK: Evaluate internal controls over financial reporting and identify deficiencies.
        
        CONTROL ENVIRONMENT:
        ${JSON.stringify(controlEnvironment, null, 2)}
        
        CONTROL ACTIVITIES:
        ${JSON.stringify(controlActivities, null, 2)}
        
        RISK ASSESSMENT PROCESS:
        ${JSON.stringify(riskAssessment, null, 2)}
        
        INFORMATION SYSTEMS:
        ${JSON.stringify(informationSystems, null, 2)}
        
        Please evaluate:
        
        1. CONTROL ENVIRONMENT ASSESSMENT:
           - Tone at the top evaluation
           - Management philosophy and style
           - Organizational structure adequacy
           - Human resource policies
           - Board and audit committee effectiveness
        
        2. RISK ASSESSMENT PROCESS:
           - Risk identification procedures
           - Risk analysis methodology
           - Change management processes
           - Fraud risk assessment
           - Control design adequacy
        
        3. CONTROL ACTIVITIES:
           - Authorization controls
           - Segregation of duties
           - Documentation and recording
           - Physical safeguards
           - Performance reviews
        
        4. INFORMATION & COMMUNICATION:
           - Financial reporting system
           - Communication channels
           - Management reporting
           - External communication
           - Information quality
        
        5. MONITORING ACTIVITIES:
           - Ongoing monitoring procedures
           - Separate evaluations
           - Internal audit function
           - Management self-assessment
           - Corrective actions process
        
        6. DEFICIENCY IDENTIFICATION:
           - Control gaps and weaknesses
           - Severity assessment (significant, material)
           - Impact on audit strategy
           - Management communication requirements
           - Remediation recommendations
        
        Provide specific recommendations for control improvements and their impact on audit procedures.
        Classify deficiencies by severity and audit strategy implications.`;
    }
    
    // Materiality calculation prompt
    getMaterialityCalculationPrompt(financialStatements, auditRisk, userNeeds) {
        return `${this.baseContext}
        
        TASK: Calculate appropriate materiality levels for the financial statement audit.
        
        FINANCIAL STATEMENTS:
        ${JSON.stringify(financialStatements, null, 2)}
        
        AUDIT RISK ASSESSMENT:
        ${JSON.stringify(auditRisk, null, 2)}
        
        USER INFORMATION NEEDS:
        ${JSON.stringify(userNeeds, null, 2)}
        
        Calculate and justify:
        
        1. OVERALL MATERIALITY:
           - Appropriate benchmark selection
           - Percentage application rationale
           - Qualitative factors consideration
           - User expectations assessment
           - Risk-based adjustments
        
        2. PERFORMANCE MATERIALITY:
           - Risk-based percentage selection
           - Account-specific considerations
           - Aggregation risk assessment
           - Control environment impact
           - Detection risk relationship
        
        3. CLEARLY TRIVIAL THRESHOLD:
           - Appropriate percentage of materiality
           - Individual item evaluation
           - Accumulation threshold
           - Reporting implications
           - Communication considerations
        
        4. ACCOUNT-SPECIFIC MATERIALITY:
           - Lower materiality accounts
           - Regulatory requirements
           - Stakeholder expectations
           - Risk-sensitive areas
           - Disclosure materiality
        
        5. QUALITATIVE FACTORS:
           - Regulatory environment
           - Debt covenant considerations
           - Management compensation impact
           - Market expectations
           - Prior period adjustments
        
        Provide specific dollar amounts with detailed justifications for each materiality level.
        Include guidance on application throughout the audit process.`;
    }
    
    // Management letter recommendations prompt
    getManagementLetterPrompt(auditFindings, controlDeficiencies, businessObservations, industryBestPractices) {
        return `${this.baseContext}
        
        TASK: Prepare management letter recommendations based on audit findings and observations.
        
        AUDIT FINDINGS:
        ${JSON.stringify(auditFindings, null, 2)}
        
        CONTROL DEFICIENCIES:
        ${JSON.stringify(controlDeficiencies, null, 2)}
        
        BUSINESS OBSERVATIONS:
        ${JSON.stringify(businessObservations, null, 2)}
        
        INDUSTRY BEST PRACTICES:
        ${JSON.stringify(industryBestPractices, null, 2)}
        
        Develop recommendations for:
        
        1. INTERNAL CONTROL IMPROVEMENTS:
           - Segregation of duties enhancements
           - Authorization control improvements
           - Documentation and recordkeeping
           - IT controls and system security
           - Monitoring and review procedures
        
        2. FINANCIAL REPORTING ENHANCEMENTS:
           - Month-end closing process
           - Financial statement preparation
           - Disclosure completeness and accuracy
           - Supporting documentation
           - Review and approval procedures
        
        3. OPERATIONAL EFFICIENCY:
           - Process improvements
           - Technology utilization
           - Resource optimization
           - Performance measurement
           - Cost reduction opportunities
        
        4. COMPLIANCE MATTERS:
           - Regulatory compliance
           - Tax compliance improvements
           - Industry-specific requirements
           - Documentation requirements
           - Training and awareness
        
        5. BUSINESS ADVISORY:
           - Strategic considerations
           - Market opportunities
           - Risk management improvements
           - Technology investments
           - Succession planning
        
        For each recommendation:
        - Provide clear business rationale
        - Assess implementation difficulty
        - Estimate cost/benefit impact
        - Suggest implementation timeline
        - Identify success metrics
        
        Prioritize recommendations by importance and ease of implementation.
        Write in professional, constructive language that maintains the client relationship.`;
    }
    
    // Workpaper review prompt
    getWorkpaperReviewPrompt(workpapers, auditProgram, findings, conclusions) {
        return `${this.baseContext}
        
        TASK: Review audit workpapers for completeness, accuracy, and appropriate conclusions.
        
        WORKPAPERS SUMMARY:
        ${JSON.stringify(workpapers, null, 2)}
        
        AUDIT PROGRAM:
        ${JSON.stringify(auditProgram, null, 2)}
        
        FINDINGS:
        ${JSON.stringify(findings, null, 2)}
        
        CONCLUSIONS:
        ${JSON.stringify(conclusions, null, 2)}
        
        Review for:
        
        1. WORKPAPER QUALITY:
           - Objectives clearly stated
           - Procedures adequately documented
           - Evidence properly referenced
           - Conclusions clearly stated
           - Reviewer sign-off complete
        
        2. AUDIT PROGRAM COMPLETION:
           - All procedures performed
           - Exceptions properly investigated
           - Alternative procedures documented
           - Sample sizes adequate
           - Testing objectives met
        
        3. EVIDENCE SUFFICIENCY:
           - Quantity of evidence adequate
           - Quality of evidence appropriate
           - Source reliability assessed
           - Corroborating evidence obtained
           - Contradictory evidence addressed
        
        4. CONCLUSION APPROPRIATENESS:
           - Supported by evidence
           - Address audit objectives
           - Consider all exceptions
           - Appropriate professional judgment
           - Risk assessment alignment
        
        5. AREAS FOR IMPROVEMENT:
           - Additional procedures needed
           - Documentation deficiencies
           - Conclusion clarifications
           - Evidence gaps
           - Professional skepticism application
        
        Identify specific workpaper sections requiring additional work or clarification.
        Provide guidance on improving audit documentation quality and efficiency.`;
    }
}

// Export to global scope
window.AuditPulse = window.AuditPulse || {};
window.AuditPulse.modules = window.AuditPulse.modules || {};
window.AuditPulse.modules.financial_audit = window.AuditPulse.modules.financial_audit || {};
window.AuditPulse.modules.financial_audit.prompts = new FinancialAuditPrompts();