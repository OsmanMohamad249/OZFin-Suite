# AuditPulse - Comprehensive Audit ERP

A modular, cloud-native Single Page Application (SPA) built with Vanilla JavaScript, Tailwind CSS, Chart.js, and Lucide Icons. AuditPulse serves as a comprehensive Audit ERP for managing multiple audit types with AI assistant integration (Gemini API).

![AuditPulse Dashboard](https://github.com/user-attachments/assets/7f70bf8c-dde8-4bdb-ae4f-ef529fd54f2b)

## ✨ Features

### 🔧 Core Capabilities
- **Multi-Language Support**: Full English/Arabic internationalization
- **5 Audit Modules**: Financial, Compliance, Operational, Internal, and Financial Control audits
- **9-Step Workflow**: Complete audit process from planning to reporting
- **AI Integration**: Gemini API for risk analysis and audit recommendations
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Analytics**: Dashboard with KPIs, charts, and progress tracking

### 📊 Audit Modules (Fully Implemented)
1. **Financial Audit** - Comprehensive financial statement audits
2. **Compliance Audit** - Regulatory compliance verification
3. **Operational Audit** - Process efficiency and effectiveness
4. **Internal Audit** - Internal controls and governance
5. **Financial Control Audit** - Financial controls and procedures

### 🔄 9-Step Audit Workflow
1. **Activity Selection** - Choose audit type and scope
2. **Company Information** - Gather entity details and audit period
3. **Data Upload** - File import or API connection to ERP systems
4. **Account Mapping** - Map to standard chart of accounts
5. **Risk Analysis** - AI-powered risk identification and assessment
6. **Audit Planning** - Generate objectives, procedures, and assignments
7. **Task Management** - Kanban board with approval workflows
8. **Reconciliation** - Validate account balances and perform testing
9. **Reports** - Generate and export comprehensive audit outputs

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- HTTP server (for local development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/OsmanMohamad249/OZFin-Suite.git
cd OZFin-Suite
```

2. **Start a local server**
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server . -p 8000

# Using PHP
php -S localhost:8000
```

3. **Open in browser**
Navigate to `http://localhost:8000`

### Running on Replit
1. Import the project to Replit
2. The application will automatically serve on the provided URL
3. No additional configuration required

## 📁 Project Structure

```
/
├── index.html                 # Main application entry point
├── style.css                  # Custom CSS styles and Tailwind configuration
├── script.js                  # Main SPA router & state management
│
├── components/                # UI Components
│   ├── dashboard.js          # Dashboard with KPIs and charts
│   ├── workflowSteps.js      # 9-step audit workflow components
│   └── reports.js            # Report generation and export
│
├── utils/                     # Utility Functions
│   ├── api.js                # API integrations (Gemini, ERP, etc.)
│   └── calculations.js       # Financial calculations and risk scoring
│
├── i18n/                      # Internationalization
│   ├── en.json               # English translations
│   └── ar.json               # Arabic translations
│
├── modules/                   # Audit Modules
│   ├── financial_audit/
│   │   ├── workflow.json     # Audit workflow configuration
│   │   ├── components.js     # Module-specific UI components
│   │   └── prompts.js        # AI prompts for Gemini API
│   │
│   ├── compliance_audit/
│   │   ├── workflow.json
│   │   ├── components.js
│   │   └── prompts.js
│   │
│   ├── operational_audit/
│   │   └── workflow.json
│   │
│   ├── internal_audit/
│   │   └── workflow.json
│   │
│   └── financial_control_audit/
│       └── workflow.json
│
└── assets/                    # Static assets (images, documents)
```

## 🔌 API Integrations

### Gemini AI Integration
Configure your Gemini API key for AI-powered features:
```javascript
// In browser console or configuration
window.AuditPulse.utils.api.gemini.setApiKey('your-gemini-api-key');
```

### ERP System Connectors
Supported ERP systems:
- SAP
- Oracle
- Microsoft Dynamics
- NetSuite
- QuickBooks
- Custom APIs

### Data Import Formats
- Excel (.xlsx, .xls)
- CSV files
- JSON data
- Direct API connections

## 🌍 Multi-Language Support

AuditPulse supports English and Arabic languages with full RTL (Right-to-Left) support for Arabic.

**Switch Language:**
- Click the language toggle button (EN/AR) in the top-right corner
- Language preference is automatically saved

**Adding New Languages:**
1. Create a new JSON file in `/i18n/` folder (e.g., `fr.json`)
2. Add translations following the existing key structure
3. Update the language switcher in `script.js`

## 📊 Audit Module Configuration

Each audit module contains:

### workflow.json
```json
{
  "name": "Audit Module Name",
  "description": "Module description",
  "steps": [...],
  "riskAreas": [...],
  "objectives": [...],
  "procedures": [...]
}
```

### components.js
UI components specific to the audit module:
- Step renderers
- Data input forms
- Validation logic
- Navigation handlers

### prompts.js
AI prompts for Gemini API integration:
- Risk assessment prompts
- Procedure generation
- Report recommendations

## 🤖 AI Assistant (Gemini API)

AuditPulse integrates with Google's Gemini API to provide:

- **Risk Analysis**: Automated identification of high-risk areas
- **Procedure Generation**: AI-generated audit procedures
- **Anomaly Detection**: Pattern recognition in financial data
- **Report Recommendations**: Intelligent audit findings analysis

## 📈 Dashboard & Analytics

The dashboard provides real-time insights:
- Active audits count
- Team member statistics
- High-risk area identification
- Completed tasks tracking
- Progress visualization
- Recent activity feed

## 🔧 Development

### Adding New Audit Modules

1. **Create module directory**
```bash
mkdir modules/new_audit_type
```

2. **Create workflow.json**
Define the audit steps, risk areas, and procedures

3. **Create components.js**
Implement UI components for the module

4. **Create prompts.js**
Define AI prompts for the specific audit type

5. **Register the module**
Update the module registry in `script.js`

### Customizing Styles
- Modify `style.css` for custom styling
- Update Tailwind configuration in `index.html`
- Add new CSS classes following the existing pattern

### Extending API Integrations
- Add new connectors in `utils/api.js`
- Implement authentication and data mapping
- Update the UI to support new integrations

## 🧪 Testing

### Manual Testing
1. Start the local server
2. Navigate through each audit module
3. Test multi-language functionality
4. Verify data upload and processing
5. Check responsive design on different devices

### Browser Compatibility
- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

## 📋 Deployment

### Production Deployment
1. **Static Hosting**: Deploy to any static hosting service
2. **Configure APIs**: Set up API keys for production
3. **Enable HTTPS**: Required for modern browser features
4. **Update CDN URLs**: Ensure CDN resources are accessible

### Environment Configuration
```javascript
// Production configuration
const PRODUCTION_CONFIG = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  erpEndpoint: process.env.ERP_ENDPOINT,
  // ... other config
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Code Style Guidelines
- Use ES6+ JavaScript features
- Follow consistent naming conventions
- Add comments for complex functions
- Maintain responsive design principles
- Test multi-language functionality

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Review the documentation
- Check existing issues for solutions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Powered by Google's Gemini AI
- UI components by Tailwind CSS
- Icons by Lucide
- Charts by Chart.js

---

**AuditPulse** - Comprehensive Audit Management with AI Intelligence