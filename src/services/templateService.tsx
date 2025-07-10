import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { CVTemplate } from '../types';
import { FileText, Sparkles, Code, Target, BookOpen, GraduationCap, RefreshCw, Crown, Palette, Brain } from 'lucide-react';

export const fetchCVTemplates = async (): Promise<CVTemplate[]> => {
  try {
    console.log('Attempting to fetch templates from Firestore...');
    const templatesRef = collection(db, 'cvTemplates');
    const q = query(templatesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const templates: CVTemplate[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Template data:', data);
      templates.push({
        id: doc.id,
        name: data.name || 'Untitled Template',
        description: data.description || 'No description available',
        category: data.category || 'General',
        icon: <FileText className="h-6 w-6" />,
        markdownUrl: data.markdownUrl || '',
        previewImage: data.previewImage,
        tags: data.tags || [],
        difficulty: data.difficulty || 'Intermediate',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    console.log(`Successfully fetched ${templates.length} templates from Firestore`);
    
    // If no templates found in Firestore, return fallback templates
    if (templates.length === 0) {
      console.log('No templates found in Firestore, using fallback templates');
      return getFallbackTemplates();
    }
    
    return templates;
  } catch (error) {
    console.warn('Firestore access failed (likely permissions issue), using built-in templates:', error);
    // Return fallback templates if Firestore fails
    return getFallbackTemplates();
  }
};

export const fetchTemplateContent = async (markdownUrl: string): Promise<string> => {
  try {
    // If it's a relative URL, try to fetch from public folder
    if (markdownUrl.startsWith('/')) {
      const response = await fetch(markdownUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      return await response.text();
    }
    
    // If it's an absolute URL, fetch directly
    if (markdownUrl.startsWith('http')) {
      const response = await fetch(markdownUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      return await response.text();
    }
    
    // If no valid URL, return default content
    throw new Error('Invalid template URL');
  } catch (error) {
    console.error('Error fetching template content:', error);
    return getDefaultTemplateContent();
  }
};

const getFallbackTemplates = (): CVTemplate[] => [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    description: 'Balanced, works for all jobs - perfect for traditional industries',
    category: 'Universal',
    icon: <FileText className="h-6 w-6" />,
    markdownUrl: 'fallback-classic',
    tags: ['professional', 'universal', 'ats-safe', 'traditional'],
    difficulty: 'Beginner',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and sleek design perfect for startups and creative roles',
    category: 'Modern',
    icon: <Sparkles className="h-6 w-6" />,
    markdownUrl: 'fallback-modern',
    tags: ['modern', 'minimal', 'startup', 'creative'],
    difficulty: 'Intermediate',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tech-focus',
    name: 'Tech Focus',
    description: 'Highlight projects, skills, and technical stack for developers',
    category: 'Technology',
    icon: <Code className="h-6 w-6" />,
    markdownUrl: 'fallback-tech',
    tags: ['technical', 'developer', 'projects', 'programming'],
    difficulty: 'Intermediate',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'project-based',
    name: 'Project-Based',
    description: 'Best for consultants, freelancers, and project managers',
    category: 'Consulting',
    icon: <Target className="h-6 w-6" />,
    markdownUrl: 'fallback-project',
    tags: ['consulting', 'freelance', 'projects', 'management'],
    difficulty: 'Advanced',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Perfect for researchers with publications and citations',
    category: 'Academic',
    icon: <BookOpen className="h-6 w-6" />,
    markdownUrl: 'fallback-academic',
    tags: ['academic', 'research', 'publications', 'education'],
    difficulty: 'Advanced',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate',
    description: 'No experience? No problem. Focus on potential and skills',
    category: 'Entry Level',
    icon: <GraduationCap className="h-6 w-6" />,
    markdownUrl: 'fallback-graduate',
    tags: ['entry-level', 'graduate', 'internship', 'potential'],
    difficulty: 'Beginner',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'career-change',
    name: 'Career Change',
    description: 'Focused on transferable skills for career transitions',
    category: 'Transition',
    icon: <RefreshCw className="h-6 w-6" />,
    markdownUrl: 'fallback-career-change',
    tags: ['career-change', 'transferable', 'transition', 'skills'],
    difficulty: 'Intermediate',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Executive-style layout for senior management roles',
    category: 'Executive',
    icon: <Crown className="h-6 w-6" />,
    markdownUrl: 'fallback-leadership',
    tags: ['executive', 'leadership', 'management', 'senior'],
    difficulty: 'Advanced',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'design-lite',
    name: 'Design Lite',
    description: 'Stylish but ATS-friendly for creative professionals',
    category: 'Creative',
    icon: <Palette className="h-6 w-6" />,
    markdownUrl: 'fallback-design',
    tags: ['creative', 'design', 'stylish', 'ats-friendly'],
    difficulty: 'Intermediate',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ai-aided',
    name: 'AI-Aided',
    description: 'Designed using AI for maximum real-world impact',
    category: 'AI-Optimized',
    icon: <Brain className="h-6 w-6" />,
    markdownUrl: 'fallback-ai',
    tags: ['ai-optimized', 'modern', 'impact', 'results'],
    difficulty: 'Advanced',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getTemplateContentByType = (templateId: string): string => {
  const templates: { [key: string]: string } = {
    'fallback-classic': `# [Your Full Name]
**[Your Professional Title]**

📧 [your.email@example.com] | 📱 [+1-234-567-8900] | 🌐 [linkedin.com/in/yourname] | 📍 [City, State]

---

## PROFESSIONAL SUMMARY
Experienced [Your Profession] with [X] years of expertise in [key skills/industry]. Proven track record of [major achievement] and strong background in [relevant areas]. Seeking to leverage [specific skills] to drive [company goal/value] at [target company type].

---

## CORE COMPETENCIES
• [Skill 1] • [Skill 2] • [Skill 3] • [Skill 4]
• [Skill 5] • [Skill 6] • [Skill 7] • [Skill 8]

---

## PROFESSIONAL EXPERIENCE

### [Job Title] | [Company Name]
**[Month Year] - [Month Year] | [City, State]**
• [Achievement with quantifiable result - increased/decreased/improved X by Y%]
• [Responsibility that demonstrates relevant skill for target role]
• [Project or initiative you led with measurable outcome]
• [Technical skill or tool you used to solve business problem]

### [Previous Job Title] | [Previous Company Name]
**[Month Year] - [Month Year] | [City, State]**
• [Achievement with quantifiable result]
• [Responsibility showing progression/growth]
• [Cross-functional collaboration example]

---

## EDUCATION
**[Degree Type] in [Field of Study]** | [University Name]
[Graduation Year] | [City, State]
• Relevant Coursework: [Course 1], [Course 2], [Course 3]
• [Honor/Award if applicable]

---

## CERTIFICATIONS & TRAINING
• [Certification Name] - [Issuing Organization] ([Year])
• [Training Program] - [Provider] ([Year])

---

## TECHNICAL SKILLS
**Software:** [List relevant software/tools]
**Programming:** [If applicable - languages, frameworks]
**Systems:** [Databases, platforms, etc.]`,

    'fallback-modern': `# [Your Name]
## [Your Professional Title]

**Contact:** [email@example.com] • [phone] • [LinkedIn] • [Portfolio/Website]

---

### 🎯 PROFESSIONAL SUMMARY
Dynamic [profession] with [X] years of experience driving [key achievement]. Passionate about [relevant area] with expertise in [core skills]. Ready to bring innovative solutions and [specific value] to forward-thinking organizations.

---

### 💼 EXPERIENCE

**[Current/Recent Position]** | [Company] | [Dates]
→ [Impact-focused achievement with metrics]
→ [Innovation or improvement you implemented]
→ [Leadership or collaboration highlight]

**[Previous Position]** | [Company] | [Dates]
→ [Quantifiable achievement]
→ [Process improvement or efficiency gain]
→ [Skill demonstration relevant to target role]

---

### 🛠️ SKILLS & EXPERTISE
**Core Competencies:** [Skill] • [Skill] • [Skill] • [Skill]
**Technical:** [Tool/Software] • [Platform] • [System]
**Soft Skills:** [Leadership] • [Communication] • [Problem-solving]

---

### 🎓 EDUCATION & CERTIFICATIONS
**[Degree]** in [Field] | [University] | [Year]
**Certifications:** [Cert 1] • [Cert 2] • [Cert 3]

---

### 🚀 KEY ACHIEVEMENTS
• [Major accomplishment with quantifiable impact]
• [Award, recognition, or notable project]
• [Innovation or process improvement you led]`,

    'fallback-tech': `# [Your Name]
## Software Engineer | Full-Stack Developer

**📧** [email@example.com] **|** **📱** [phone] **|** **🔗** [github.com/username] **|** **💼** [linkedin.com/in/username]

---

## 🚀 TECHNICAL SUMMARY
Passionate software engineer with [X] years of experience building scalable web applications. Expertise in [primary tech stack] with a strong foundation in [secondary skills]. Proven ability to deliver high-quality code and collaborate effectively in agile environments.

---

## 💻 TECHNICAL SKILLS

**Languages:** JavaScript, TypeScript, Python, Java, [others]
**Frontend:** React, Vue.js, HTML5, CSS3, Tailwind CSS, [others]
**Backend:** Node.js, Express, Django, Spring Boot, [others]
**Databases:** PostgreSQL, MongoDB, Redis, [others]
**Cloud & DevOps:** AWS, Docker, Kubernetes, CI/CD, [others]
**Tools:** Git, Jest, Webpack, [others]

---

## 💼 PROFESSIONAL EXPERIENCE

### Senior Software Engineer | [Company Name]
**[Start Date] - Present | [Location]**
• Developed and maintained [type of application] serving [number] users daily
• Implemented [specific technology/feature] resulting in [quantifiable improvement]
• Led code reviews and mentored [number] junior developers
• Optimized application performance, reducing load times by [percentage]

### Software Engineer | [Previous Company]
**[Start Date] - [End Date] | [Location]**
• Built responsive web applications using [tech stack]
• Collaborated with cross-functional teams in agile environment
• Wrote comprehensive unit tests achieving [percentage] code coverage
• Participated in architecture decisions for [project/system]

---

## 🛠️ KEY PROJECTS

### [Project Name] | [Technologies Used]
• [Brief description of project and your role]
• [Key technical challenge solved]
• [Measurable impact or result]
• **GitHub:** [repository-link]

### [Project Name] | [Technologies Used]
• [Brief description and technical highlights]
• [Innovation or learning outcome]
• **Live Demo:** [demo-link]

---

## 🎓 EDUCATION & CERTIFICATIONS
**[Degree] in [Field]** | [University] | [Year]
**Certifications:** [AWS Certified Developer] • [Other Cert] • [Other Cert]`,

    'fallback-project': `# [Your Name]
## Project Manager | Business Consultant

**Contact:** [email] • [phone] • [LinkedIn] • [City, Country]

---

## EXECUTIVE SUMMARY
Results-driven project manager with [X] years of experience delivering complex projects on time and within budget. Proven expertise in [methodology - Agile/Waterfall/Hybrid] with a track record of managing projects worth $[amount] and leading cross-functional teams of [size].

---

## CORE COMPETENCIES
**Project Management:** Agile • Scrum • Waterfall • Risk Management • Budget Control
**Tools:** Jira • Asana • MS Project • Confluence • Slack • Trello
**Methodologies:** PMP • Lean Six Sigma • Change Management • Stakeholder Engagement

---

## PROFESSIONAL EXPERIENCE

### Senior Project Manager | [Company Name]
**[Dates] | [Location]**
• Managed portfolio of [number] concurrent projects with combined budget of $[amount]
• Led cross-functional teams of [size] including developers, designers, and stakeholders
• Implemented agile methodologies, improving delivery speed by [percentage]
• Reduced project costs by [amount/percentage] through process optimization

**Key Projects:**
→ **[Project Name]:** [Brief description, duration, budget, outcome]
→ **[Project Name]:** [Brief description, key challenge solved, impact]

### Project Coordinator | [Previous Company]
**[Dates] | [Location]**
• Coordinated [number] projects simultaneously across multiple departments
• Facilitated daily standups, sprint planning, and retrospectives
• Maintained project documentation and stakeholder communication

---

## PROJECT PORTFOLIO

### [Major Project Name] | [Duration] | [Budget]
**Challenge:** [What problem needed solving]
**Solution:** [Your approach and methodology]
**Results:** [Quantifiable outcomes and impact]
**Technologies:** [Tools and systems used]

### [Another Project] | [Duration] | [Budget]
**Scope:** [Project description and objectives]
**Delivery:** [How you ensured successful completion]
**Impact:** [Business value created]

---

## EDUCATION & CERTIFICATIONS
**[Degree]** in [Field] | [University] | [Year]
**Certifications:**
• Project Management Professional (PMP) - PMI
• Certified Scrum Master (CSM) - Scrum Alliance
• [Other relevant certifications]

---

## ACHIEVEMENTS
• Delivered [percentage] of projects on time and within budget over [time period]
• Managed projects with cumulative value of $[amount]
• Led digital transformation initiative affecting [number] employees`,

    'fallback-academic': `# [Your Full Name], [Degree Abbreviations]
## [Academic Title/Position] | [Department] | [Institution]

**Email:** [email@university.edu] **|** **Phone:** [phone] **|** **ORCID:** [0000-0000-0000-0000]
**Address:** [Department, University, City, State, ZIP]

---

## RESEARCH INTERESTS
[Primary research area], [Secondary area], [Methodology/approach], [Specific focus within field]

---

## EDUCATION

**Ph.D. in [Field]** | [University] | [Year]
*Dissertation:* "[Title of Dissertation]"
*Advisor:* [Advisor Name]

**M.S./M.A. in [Field]** | [University] | [Year]
*Thesis:* "[Title of Thesis]"

**B.S./B.A. in [Field]** | [University] | [Year]
*Magna Cum Laude* | [Honors/Awards]

---

## ACADEMIC APPOINTMENTS

**[Current Position]** | [Institution] | [Start Year - Present]
[Department/School Name]

**[Previous Position]** | [Institution] | [Start Year - End Year]
[Department/School Name]

---

## PUBLICATIONS

### Peer-Reviewed Journal Articles
1. [Author list]. ([Year]). "[Article Title]." *[Journal Name]*, [Volume]([Issue]), [pages]. DOI: [doi]
2. [Author list]. ([Year]). "[Article Title]." *[Journal Name]*, [Volume]([Issue]), [pages]. DOI: [doi]
3. [Continue listing in reverse chronological order]

### Book Chapters
1. [Author list]. ([Year]). "[Chapter Title]." In [Editor(s)], *[Book Title]* (pp. [pages]). [Publisher].

### Conference Presentations
1. [Author list]. ([Year, Month]). "[Presentation Title]." Paper presented at [Conference Name], [Location].

---

## GRANTS & FUNDING

**[Grant Title]** | [Funding Agency] | [Amount] | [Years]
*Role:* [Principal Investigator/Co-PI/Collaborator]

**[Grant Title]** | [Funding Agency] | [Amount] | [Years]
*Role:* [Your role]

---

## TEACHING EXPERIENCE

**[Course Number]: [Course Title]** | [Semester Year] | [Institution]
*Enrollment:* [Number] students | *Evaluation:* [Rating/Score]

**[Course Number]: [Course Title]** | [Semester Year] | [Institution]
*Description:* [Brief course description and your innovations]

---

## SERVICE

### Editorial Service
• [Journal Name] - [Role] ([Years])
• [Journal Name] - [Role] ([Years])

### Professional Service
• [Organization] - [Committee/Role] ([Years])
• [Conference] - [Role] ([Year])

### University Service
• [Committee Name] - [Role] ([Years])
• [Department Role] ([Years])

---

## AWARDS & HONORS
• [Award Name] - [Organization] ([Year])
• [Fellowship/Grant] - [Organization] ([Year])
• [Recognition] - [Organization] ([Year])

---

## PROFESSIONAL MEMBERSHIPS
• [Professional Organization] ([Years])
• [Academic Society] ([Years])

---

## TECHNICAL SKILLS
**Research Methods:** [Quantitative/Qualitative methods you use]
**Software:** [Statistical software, analysis tools]
**Languages:** [Programming languages if applicable]`,

    'fallback-graduate': `# [Your Name]
## Recent [Degree] Graduate | Aspiring [Target Role]

**📧** [email@example.com] **|** **📱** [phone] **|** **🔗** [linkedin.com/in/yourname] **|** **📍** [City, State]

---

## 🎯 PROFESSIONAL OBJECTIVE
Motivated [degree] graduate with strong foundation in [relevant field/skills]. Eager to apply academic knowledge and [relevant experience - internships/projects/volunteer work] to contribute to [target industry/company type]. Passionate about [specific area] and committed to continuous learning and professional growth.

---

## 🎓 EDUCATION

**[Degree Type] in [Major]** | [University Name] | [Graduation Month Year]
*GPA:* [X.XX/4.0] | *Magna Cum Laude* [if applicable]

**Relevant Coursework:**
• [Course 1] • [Course 2] • [Course 3] • [Course 4]
• [Course 5] • [Course 6] • [Course 7] • [Course 8]

**Academic Projects:**
• **[Project Name]:** [Brief description of project, skills used, and outcome]
• **[Project Name]:** [Description highlighting relevant skills for target role]

---

## 💼 EXPERIENCE

### [Internship Title] | [Company Name]
**[Start Date] - [End Date] | [Location]**
• [Achievement or responsibility that demonstrates relevant skills]
• [Specific contribution you made to team/project]
• [Learning outcome or skill developed]
• [Quantifiable result if possible]

### [Part-time Job/Work Study] | [Organization]
**[Start Date] - [End Date] | [Location]**
• [Responsibility that shows work ethic and relevant skills]
• [Example of problem-solving or initiative]
• [Leadership or teamwork example]

### [Volunteer Position] | [Organization]
**[Start Date] - [End Date] | [Location]**
• [Contribution that demonstrates relevant skills]
• [Leadership or organizational skills shown]

---

## 🛠️ SKILLS & COMPETENCIES

**Technical Skills:**
• [Software/Tools relevant to target role]
• [Programming languages if applicable]
• [Industry-specific tools or platforms]

**Core Competencies:**
• [Analytical Skills] • [Communication] • [Problem-Solving]
• [Teamwork] • [Adaptability] • [Time Management]

**Languages:** [Language] (Fluent), [Language] (Conversational)

---

## 🏆 ACHIEVEMENTS & ACTIVITIES

**Academic Honors:**
• [Dean's List] - [Semesters]
• [Scholarship Name] - [Year]
• [Academic Award] - [Year]

**Leadership & Activities:**
• [Student Organization] - [Role] ([Years])
• [Club/Society] - [Position] ([Years])
• [Volunteer Activity] - [Hours/Impact]

**Certifications:**
• [Relevant Certification] - [Issuing Organization] ([Year])
• [Online Course Completion] - [Platform] ([Year])

---

## 📚 PROJECTS & PORTFOLIO

### [Academic/Personal Project Name]
**Technologies/Skills Used:** [List relevant tools/skills]
• [Description of project and your role]
• [Challenge overcome or skill demonstrated]
• [Result or learning outcome]
• **Link:** [GitHub/Portfolio link if applicable]

### [Another Project]
**Context:** [Class project/Personal initiative/Hackathon]
• [Brief description and your contribution]
• [Skills applied or developed]
• [Impact or recognition received]

---

## 🌟 ADDITIONAL INFORMATION
• **Interests:** [Professional interests that align with target role]
• **Availability:** [When you can start]
• **Willingness to relocate:** [Yes/No/Specific locations]`,

    'fallback-career-change': `# [Your Name]
## [Current Title] Transitioning to [Target Role]

**📧** [email@example.com] **|** **📱** [phone] **|** **🔗** [linkedin.com/in/yourname] **|** **📍** [City, State]

---

## 🎯 CAREER TRANSITION SUMMARY
Accomplished [current profession] with [X] years of experience seeking to leverage transferable skills in [target field]. Strong background in [relevant skills from current role] with proven ability to [key achievement]. Completed [relevant training/certification] to bridge into [target industry].

---

## 🔄 TRANSFERABLE SKILLS

**Leadership & Management:**
• [Specific example of leadership from current role]
• [Team management or project coordination experience]
• [Change management or process improvement]

**Analytical & Problem-Solving:**
• [Data analysis or research skills from current role]
• [Complex problem-solving examples]
• [Strategic thinking or planning experience]

**Communication & Collaboration:**
• [Client/stakeholder management experience]
• [Presentation or training experience]
• [Cross-functional collaboration examples]

---

## 💼 PROFESSIONAL EXPERIENCE

### [Current/Recent Position] | [Company Name]
**[Start Date] - [End Date] | [Location]**
• [Achievement that demonstrates skills relevant to target role]
• [Responsibility that shows transferable competency]
• [Project or initiative that relates to target field]
• [Quantifiable result that shows impact]

*Transferable Skills Demonstrated:* [List 3-4 skills relevant to target role]

### [Previous Position] | [Company Name]
**[Start Date] - [End Date] | [Location]**
• [Achievement showing progression and relevant skills]
• [Cross-functional work or diverse responsibilities]
• [Innovation or improvement you implemented]

*Key Competencies:* [Skills that apply to target role]

---

## 🎓 EDUCATION & PROFESSIONAL DEVELOPMENT

**[Degree] in [Field]** | [University] | [Year]
*Relevant Coursework:* [Courses that apply to target role]

**Transition-Focused Training:**
• [Certification/Course Name] - [Provider] ([Year])
• [Bootcamp/Program] - [Institution] ([Year])
• [Online Learning] - [Platform] ([Year])

**Continuing Education:**
• [Workshop/Seminar] - [Topic relevant to target role]
• [Professional Development] - [Skills gained]

---

## 🚀 RELEVANT PROJECTS & INITIATIVES

### [Project Name] | [Context - Work/Personal/Training]
**Skills Applied:** [List technical and soft skills used]
• [Description of project and your role]
• [How it relates to target field]
• [Outcome or learning achieved]
• **Portfolio Link:** [If applicable]

### [Another Project/Initiative]
**Challenge:** [Problem you solved]
**Approach:** [Methods or skills you used]
**Result:** [Outcome and relevance to target role]

---

## 🏆 ACHIEVEMENTS & RECOGNITION

**Professional Accomplishments:**
• [Award or recognition from current field]
• [Quantifiable achievement with business impact]
• [Leadership recognition or promotion]

**Transition Milestones:**
• [Certification earned for target field]
• [Networking or industry involvement]
• [Volunteer work in target area]

---

## 🛠️ TECHNICAL & CORE SKILLS

**Technical Skills (Target Role):**
• [New skills learned through training/self-study]
• [Software/tools relevant to target position]
• [Industry-specific knowledge gained]

**Core Competencies:**
• [Skill from current role] → [How it applies to target role]
• [Another transferable skill] → [Target role application]
• [Third skill] → [Relevance to new field]

---

## 🌟 WHY THIS TRANSITION

*Motivation:* [Brief explanation of why you're changing careers]
*Value Proposition:* [What unique perspective you bring from your background]
*Commitment:* [Steps you've taken to prepare for this transition]`,

    'fallback-leadership': `# [Your Full Name]
## [Executive Title] | [Industry] Leader

**📧** [email@company.com] **|** **📱** [phone] **|** **🔗** [linkedin.com/in/yourname] **|** **📍** [City, State]

---

## EXECUTIVE SUMMARY

Visionary [title] with [X]+ years of progressive leadership experience driving organizational growth and transformation. Proven track record of [key achievement - revenue growth/market expansion/operational excellence]. Expert in [core competencies] with demonstrated ability to build high-performing teams and deliver sustainable results in competitive markets.

**Key Leadership Metrics:**
• Managed P&L of $[amount] with [number]% growth over [timeframe]
• Led organizations of [number]+ employees across [number] locations/regions
• Delivered [specific achievement] resulting in $[amount] value creation

---

## CORE LEADERSHIP COMPETENCIES

**Strategic Leadership:** Vision Development • Strategic Planning • Market Analysis • Competitive Intelligence
**Operational Excellence:** Process Optimization • Performance Management • Quality Assurance • Cost Control
**People Leadership:** Team Building • Talent Development • Change Management • Succession Planning
**Financial Acumen:** P&L Management • Budget Planning • Financial Analysis • Investment Strategy

---

## EXECUTIVE EXPERIENCE

### [Current Title] | [Company Name]
**[Start Date] - Present | [Location]**

*Leading [description of organization/division] with [size/scope metrics]*

**Strategic Achievements:**
• [Major strategic initiative and quantifiable result]
• [Market expansion or new business development with impact]
• [Transformation or turnaround accomplishment]

**Operational Excellence:**
• [Process improvement with cost savings or efficiency gains]
• [Quality or performance improvement with metrics]
• [Technology implementation or digital transformation]

**Leadership Impact:**
• [Team development or organizational change]
• [Culture transformation or employee engagement improvement]
• [Succession planning or talent pipeline development]

### [Previous Executive Role] | [Company Name]
**[Start Date] - [End Date] | [Location]**

*Directed [scope of responsibility] for [company description]*

**Key Accomplishments:**
• [Revenue growth or market share increase with percentages]
• [Cost reduction or margin improvement with dollar amounts]
• [Acquisition integration or business expansion]
• [Regulatory compliance or risk management achievement]

---

## BOARD & ADVISORY ROLES

**[Board Position]** | [Organization Name] | [Years]
*Contribution:* [Key value you provided to the organization]

**[Advisory Role]** | [Company/Organization] | [Years]
*Focus:* [Area of expertise you provided]

---

## EDUCATION & EXECUTIVE DEVELOPMENT

**[Advanced Degree - MBA/etc.]** | [University] | [Year]
*Concentration:* [Specialization if applicable]

**Executive Education:**
• [Executive Program] - [Institution] ([Year])
• [Leadership Development] - [Provider] ([Year])
• [Industry-Specific Training] - [Organization] ([Year])

**Professional Certifications:**
• [Relevant Certification] - [Issuing Body]
• [Board Certification] - [Organization]

---

## INDUSTRY RECOGNITION & ACHIEVEMENTS

**Awards & Honors:**
• [Industry Award] - [Organization] ([Year])
• [Leadership Recognition] - [Publication/Group] ([Year])
• [Business Achievement] - [Details] ([Year])

**Speaking & Thought Leadership:**
• [Conference/Event] - "[Presentation Title]" ([Year])
• [Publication] - "[Article Title]" ([Year])
• [Industry Panel] - [Topic] ([Year])

**Professional Memberships:**
• [Industry Association] - [Role if applicable] ([Years])
• [Executive Group] - Member ([Years])

---

## SIGNATURE ACHIEVEMENTS

### [Major Achievement/Initiative]
**Challenge:** [Business problem or opportunity]
**Strategy:** [Your approach and leadership]
**Execution:** [How you led the implementation]
**Results:** [Quantifiable outcomes and business impact]

### [Another Major Achievement]
**Situation:** [Context and scope]
**Action:** [Your leadership and decision-making]
**Impact:** [Measurable results and long-term value]

---

## TECHNICAL & INDUSTRY EXPERTISE

**Industry Knowledge:** [Specific sectors/markets you know deeply]
**Functional Expertise:** [Core business functions you've led]
**Technology Proficiency:** [Relevant systems and platforms]
**Global Experience:** [International markets or operations if applicable]`,

    'fallback-design': `# [Your Name]
## Creative Professional | [Specialization]

**📧** [email@example.com] **|** **📱** [phone] **|** **🎨** [portfolio-website.com] **|** **🔗** [linkedin.com/in/yourname]

---

## CREATIVE SUMMARY
Innovative [design role] with [X] years of experience creating compelling visual solutions that drive engagement and business results. Expertise in [design specialties] with a strong foundation in both creative conceptualization and technical execution. Passionate about [design philosophy/approach] and committed to delivering pixel-perfect, user-centered designs.

---

## DESIGN EXPERTISE

**Visual Design:** Brand Identity • Typography • Color Theory • Layout Design • Print Design
**Digital Design:** UI/UX Design • Web Design • Mobile Design • Responsive Design • Prototyping
**Creative Tools:** Adobe Creative Suite • Figma • Sketch • InVision • [Other tools]
**Technical Skills:** HTML/CSS • JavaScript (Basic) • Design Systems • Version Control

---

## PROFESSIONAL EXPERIENCE

### [Current Design Role] | [Company Name]
**[Start Date] - Present | [Location]**
• Designed [type of projects] for [client type/industry] resulting in [measurable impact]
• Led creative direction for [project/campaign] achieving [specific result]
• Collaborated with [teams] to deliver [number] projects on time and within budget
• Developed [design system/brand guidelines] improving consistency across [scope]

**Key Projects:**
→ **[Project Name]:** [Brief description, your role, and impact/results]
→ **[Project Name]:** [Description focusing on creative solution and business outcome]

### [Previous Design Role] | [Company Name]
**[Start Date] - [End Date] | [Location]**
• Created [type of designs] for [audience/purpose] with [engagement/conversion metrics]
• Managed design projects from concept through final delivery
• Worked closely with [stakeholders] to translate business requirements into visual solutions

---

## FEATURED PROJECTS

### [Project Name] | [Client/Company] | [Year]
**Challenge:** [Design problem or business need]
**Solution:** [Your creative approach and design decisions]
**Tools Used:** [Software and techniques]
**Results:** [Impact on user engagement, conversions, brand recognition, etc.]
**View:** [Portfolio link or case study URL]

### [Project Name] | [Client/Company] | [Year]
**Objective:** [Project goals and constraints]
**Process:** [Your design methodology and workflow]
**Deliverables:** [What you created]
**Impact:** [Measurable outcomes or client feedback]
**Portfolio:** [Link to full case study]

### [Project Name] | [Personal/Side Project] | [Year]
**Concept:** [Creative idea and inspiration]
**Execution:** [Design process and tools used]
**Learning:** [Skills developed or techniques explored]
**Recognition:** [Awards, features, or community response]

---

## TECHNICAL PROFICIENCY

**Design Software:**
• Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects) - Expert
• Figma - Advanced • Sketch - Advanced • InVision - Intermediate
• [Other tools] - [Proficiency level]

**Web Technologies:**
• HTML5/CSS3 - Intermediate • JavaScript - Basic
• Responsive Design - Advanced • Design Systems - Advanced

**Workflow & Collaboration:**
• Agile/Scrum Methodology • Version Control (Git) • Project Management Tools
• Client Presentation • Design Critique • Cross-functional Collaboration

---

## EDUCATION & CERTIFICATIONS

**[Degree] in [Field]** | [School/University] | [Year]
*Relevant Coursework:* [Design courses, art history, etc.]

**Professional Development:**
• [Design Course/Workshop] - [Provider] ([Year])
• [Certification] - [Organization] ([Year])
• [Online Learning] - [Platform] ([Year])

---

## RECOGNITION & ACHIEVEMENTS

**Awards:**
• [Design Award] - [Organization] ([Year])
• [Competition Recognition] - [Details] ([Year])

**Features & Publications:**
• [Design Blog/Magazine] - "[Article/Feature Title]" ([Year])
• [Design Community] - Featured Work ([Year])

**Speaking & Community:**
• [Design Conference/Meetup] - "[Talk Title]" ([Year])
• [Design Community] - [Role/Contribution] ([Years])

---

## DESIGN PHILOSOPHY
"[Your personal design philosophy or approach - 2-3 sentences about what drives your creative work and how you approach design challenges]"

---

## ADDITIONAL SKILLS
**Creative Skills:** [Photography, Illustration, Animation, etc.]
**Business Acumen:** [Brand Strategy, Marketing, User Research, etc.]
**Languages:** [If relevant to target roles]`,

    'fallback-ai': `# [Your Name]
## AI-Optimized Professional | [Your Field]

**📧** [email@example.com] **|** **📱** [phone] **|** **🔗** [linkedin.com/in/yourname] **|** **🤖** [github.com/username]

---

## 🚀 AI-ENHANCED PROFESSIONAL SUMMARY
Forward-thinking [profession] leveraging artificial intelligence and data-driven insights to deliver exceptional results. [X] years of experience combining traditional expertise with cutting-edge AI tools to optimize performance, automate processes, and drive innovation. Proven track record of [key achievement] through strategic implementation of AI solutions.

**AI Impact Metrics:**
• Increased productivity by [X]% using AI-powered workflow optimization
• Reduced processing time by [X] hours through intelligent automation
• Improved accuracy by [X]% with machine learning-assisted analysis

---

## 🤖 AI & TECHNOLOGY PROFICIENCY

**AI Tools & Platforms:**
• ChatGPT/GPT-4 • Claude • Midjourney • Stable Diffusion
• [Industry-specific AI tools] • [Automation platforms]

**Data & Analytics:**
• Python • R • SQL • Tableau • Power BI
• Machine Learning Libraries • Statistical Analysis

**Productivity Enhancement:**
• AI-assisted writing and editing • Automated reporting
• Intelligent scheduling • Smart data processing

---

## 💼 PROFESSIONAL EXPERIENCE

### [Current Role] | [Company Name]
**[Start Date] - Present | [Location]**

*Pioneering AI integration in [department/function] to drive efficiency and innovation*

**AI-Driven Achievements:**
• Implemented [AI solution] resulting in [quantifiable improvement]
• Automated [process] using [AI tool], saving [time/cost] per [period]
• Enhanced [business function] with AI insights, improving [metric] by [percentage]

**Traditional Excellence:**
• [Standard achievement showing core competency]
• [Leadership or collaboration accomplishment]
• [Business impact or client success]

### [Previous Role] | [Company Name]
**[Start Date] - [End Date] | [Location]**

**Innovation & Optimization:**
• Early adopter of [AI technology] for [business application]
• Developed AI-enhanced workflows improving [specific process]
• Trained team on AI tools, increasing department efficiency by [percentage]

---

## 🎯 AI-POWERED PROJECTS & INITIATIVES

### [Project Name] | AI-Enhanced [Project Type]
**Challenge:** [Business problem requiring innovative solution]
**AI Solution:** [Specific AI tools and approaches used]
**Implementation:** [How you integrated AI into traditional workflow]
**Results:** [Quantifiable outcomes and business impact]
**Technologies:** [AI platforms, programming languages, tools]

### [Project Name] | Intelligent Automation Initiative
**Objective:** [Goal of automation project]
**AI Strategy:** [Machine learning or AI approach taken]
**Execution:** [Steps taken to implement AI solution]
**Impact:** [Time saved, accuracy improved, costs reduced]

---

## 🧠 CORE COMPETENCIES

**AI-Enhanced Skills:**
• [Traditional skill] + AI Optimization
• [Core competency] + Machine Learning Insights
• [Professional ability] + Automated Intelligence

**Technical Proficiency:**
• Prompt Engineering • AI Model Selection • Data Preprocessing
• Algorithm Understanding • AI Ethics & Bias Mitigation

**Strategic Thinking:**
• AI Implementation Strategy • Digital Transformation
• Process Optimization • Innovation Management

---

## 🎓 EDUCATION & AI LEARNING

**[Degree] in [Field]** | [University] | [Year]
*Thesis/Project:* [If AI-related]

**AI & Machine Learning Education:**
• [AI Course/Certification] - [Provider] ([Year])
• [Machine Learning Program] - [Institution] ([Year])
• [Data Science Bootcamp] - [Organization] ([Year])

**Continuous Learning:**
• [AI Newsletter/Community] - Active Member
• [Online AI Course] - [Platform] ([Year])
• [AI Conference/Workshop] - Attendee ([Year])

---

## 🏆 AI-DRIVEN ACHIEVEMENTS

**Innovation Recognition:**
• [Award for AI Implementation] - [Organization] ([Year])
• [Innovation Prize] - [Details] ([Year])

**Thought Leadership:**
• [AI Blog Post/Article] - "[Title]" ([Publication], [Year])
• [AI Presentation] - "[Title]" ([Conference/Event], [Year])
• [AI Community Contribution] - [Platform/Forum] ([Year])

**Measurable Impact:**
• Achieved [X]% improvement in [metric] through AI optimization
• Reduced [process] time from [X] to [Y] using intelligent automation
• Generated $[amount] in value through AI-enhanced decision making

---

## 🔮 FUTURE-READY SKILLS

**Emerging Technologies:**
• Large Language Models (LLMs) • Computer Vision • Natural Language Processing
• Robotic Process Automation • Predictive Analytics

**AI Ethics & Governance:**
• Responsible AI Implementation • Bias Detection & Mitigation
• AI Transparency • Data Privacy in AI Systems

**Human-AI Collaboration:**
• AI-Augmented Decision Making • Human-in-the-Loop Systems
• AI Training & Team Adoption • Change Management for AI Integration

---

## 🌟 UNIQUE VALUE PROPOSITION
"Bridging the gap between traditional expertise and AI innovation, I bring both deep domain knowledge and cutting-edge technological proficiency to drive unprecedented results. My approach combines human insight with artificial intelligence to solve complex problems and create sustainable competitive advantages."

---

## 📈 CONTINUOUS IMPROVEMENT
**Current AI Learning:** [What you're currently studying/exploring]
**Next Certification:** [Upcoming AI certification or course]
**Innovation Goals:** [How you plan to further integrate AI in your work]`
  };

  return templates[templateId] || getDefaultTemplateContent();
};

const getDefaultTemplateContent = (): string => `
# [Your Name]
**[Your Title/Position]**

📧 [email@example.com] | 📱 [phone] | 🌐 [linkedin.com/in/yourname] | 📍 [City, Country]

---

## PROFESSIONAL SUMMARY
[2-3 sentences describing your professional background, key skills, and career objectives]

---

## EXPERIENCE

### [Job Title] | [Company Name]
**[Start Date] - [End Date]**
• [Achievement or responsibility with quantifiable results]
• [Achievement or responsibility with quantifiable results]
• [Achievement or responsibility with quantifiable results]

### [Job Title] | [Company Name]
**[Start Date] - [End Date]**
• [Achievement or responsibility with quantifiable results]
• [Achievement or responsibility with quantifiable results]

---

## SKILLS
**Technical:** [List relevant technical skills]
**Tools:** [List relevant tools and software]
**Languages:** [Programming languages if applicable]

---

## EDUCATION
**[Degree] in [Field]** | [University Name]
[Graduation Year] | [Location]

---

## CERTIFICATIONS
• [Certification Name] - [Issuing Organization] ([Year])
• [Certification Name] - [Issuing Organization] ([Year])
`;