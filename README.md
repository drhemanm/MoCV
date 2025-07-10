# MoCV.mu - AI-Powered CV Platform

A comprehensive CV building and optimization platform designed specifically for Mauritians and Africans to compete in global job markets.

## 🚀 Features

- **AI-Powered CV Builder** - Create professional CVs with AI assistance
- **ATS Optimization** - Ensure your CV passes Applicant Tracking Systems
- **Market-Specific Optimization** - Tailored for 10+ global markets
- **Interview Preparation** - AI-powered mock interviews and feedback
- **CV Analysis** - Detailed scoring and improvement suggestions
- **Multiple Templates** - Professional templates for different industries
- **Real-time Chat Assistant** - Get career advice and CV help

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **PDF Generation**: html2pdf.js
- **File Processing**: Mammoth.js (DOCX), custom PDF parser

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI features)
- Firebase project (optional, for data persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mocv-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Required for AI features
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional Firebase configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   
   # Application settings
   VITE_APP_ENV=development
   VITE_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Security Configuration

### OpenAI API Key Setup

1. **Get your API key** from [OpenAI Platform](https://platform.openai.com/api-keys)

2. **Set environment variable**:
   ```bash
   # In .env file
   VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

3. **Important Security Notes**:
   - Never commit API keys to version control
   - The `.env` file is gitignored for security
   - In production, use secure environment variable management
   - Consider implementing a backend proxy for API calls

### Production Deployment Security

For production deployment:

1. **Use environment variables** on your hosting platform
2. **Implement rate limiting** for API calls
3. **Add request validation** and sanitization
4. **Use HTTPS** for all communications
5. **Consider backend API proxy** instead of client-side API calls

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Layout/          # Layout components (Header, Footer)
│   ├── CVBuilder.tsx    # Main CV builder interface
│   ├── ChatAssistant.tsx # AI chat assistant
│   └── ...
├── services/            # API and business logic
│   ├── openaiService.ts # OpenAI integration
│   ├── templateService.ts # CV templates
│   └── ...
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🌍 Supported Markets

The platform provides market-specific optimization for:

- 🇲🇺 Mauritius
- 🇿🇦 South Africa  
- 🇺🇸 United States
- 🇬🇧 United Kingdom
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇩🇪 Germany
- 🇸🇬 Singapore
- 🇦🇪 UAE
- 🌍 Global/International

## 🤖 AI Features

### With OpenAI API Key Configured:
- Advanced CV content generation
- Intelligent text enhancement
- Personalized interview questions
- Real-time chat assistance
- Detailed CV analysis

### Fallback Mode (No API Key):
- Basic CV templates and builder
- Static improvement suggestions
- Pre-defined interview questions
- Simple chat responses
- Basic ATS scoring

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Environment Variables in Netlify**:
   ```
   VITE_OPENAI_API_KEY=your_key_here
   VITE_APP_ENV=production
   ```

### Other Platforms

The app can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Components**: Add to `src/components/`
2. **Services**: Add to `src/services/`
3. **Types**: Update `src/types.ts`
4. **Styling**: Use Tailwind CSS classes

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@mocv.mu
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## 🔄 Version History

- **v1.0.0** - Initial release with core CV building features
- **v1.1.0** - Added AI enhancement and chat assistant
- **v1.2.0** - Market-specific optimizations and interview prep

---

**Made with ❤️ in Mauritius for the global African diaspora**