const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to strip markdown code blocks
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```$/, '');
  }
  return cleaned.trim();
};

// ===== COMPREHENSIVE MOCK DATA WITH MICROSKILLS =====

const mockRoadmaps = {
  web: [
    { "stepNumber": 1, "title": "Master HTML & Semantic Markup", "description": "Learn HTML5 structure, semantic elements, forms, and accessibility standards." },
    { "stepNumber": 2, "title": "Deep Dive into CSS", "description": "Master flexbox, grid, animations, and responsive design techniques." },
    { "stepNumber": 3, "title": "JavaScript Fundamentals", "description": "Understand ES6+, DOM manipulation, async programming, and event handling." },
    { "stepNumber": 4, "title": "Frontend Frameworks", "description": "Learn React/Vue component-based architecture, state management, and hooks." },
    { "stepNumber": 5, "title": "Deploy & Optimize", "description": "Deploy websites, optimize performance, and master DevTools debugging." }
  ],
  embedded: [
    { "stepNumber": 1, "title": "Master C Fundamentals", "description": "Learn variables, data types, control flow, functions, and memory management." },
    { "stepNumber": 2, "title": "Understand Pointers & Bit Operations", "description": "Deep dive into pointers, pointer arithmetic, and bit-level programming." },
    { "stepNumber": 3, "title": "Embedded C & Microcontrollers", "description": "Apply C to microcontrollers with GPIO, registers, and interrupt handling." },
    { "stepNumber": 4, "title": "Communication Protocols", "description": "Master UART, SPI, I2C, and other communication protocols." },
    { "stepNumber": 5, "title": "RTOS & Real-Time Systems", "description": "Learn real-time operating systems and task scheduling." }
  ],
  python: [
    { "stepNumber": 1, "title": "Python Basics", "description": "Learn syntax, data types, control flow, functions, and modules." },
    { "stepNumber": 2, "title": "Object-Oriented Programming", "description": "Master classes, inheritance, polymorphism, and design patterns." },
    { "stepNumber": 3, "title": "Data Science Essentials", "description": "Learn NumPy, Pandas, and Matplotlib for data manipulation and visualization." },
    { "stepNumber": 4, "title": "Backend & APIs", "description": "Build REST APIs with Flask/Django and understand databases." },
    { "stepNumber": 5, "title": "Advanced Topics", "description": "Explore async programming, testing, and deployment strategies." }
  ],
  generic: [
    { "stepNumber": 1, "title": "Learn the Fundamentals", "description": "Understand core concepts and foundational knowledge in your field." },
    { "stepNumber": 2, "title": "Apply Intermediate Skills", "description": "Build small projects to practice and reinforce your learning." },
    { "stepNumber": 3, "title": "Advanced Problem Solving", "description": "Tackle complex challenges and optimize your solutions." },
    { "stepNumber": 4, "title": "Real-World Integration", "description": "Apply skills in practical, production-ready scenarios." },
    { "stepNumber": 5, "title": "Mastery & Mentoring", "description": "Become proficient enough to teach and mentor others in these skills." }
  ]
};

const mockQuestLibrary = {
  web: [
    {
      "id": "quest-web-001",
      "title": "Build a Responsive Portfolio Website",
      "objective": "Create a personal portfolio using HTML, CSS, and JavaScript. Include projects section, about me, and contact form. Make it mobile-responsive.",
      "skillsCovered": ["HTML", "CSS", "JavaScript", "Responsive Design"],
      "microSkills": [
        "Semantic HTML5 structure",
        "Flexbox & CSS Grid layouts",
        "CSS media queries",
        "Mobile-first design",
        "JavaScript DOM manipulation",
        "Form validation",
        "Accessibility (ARIA labels)",
        "CSS animations"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 5
    },
    {
      "id": "quest-web-002",
      "title": "Create an Interactive Todo App",
      "objective": "Build a fully functional todo list with add, delete, edit, and mark-complete features using vanilla JavaScript and localStorage.",
      "skillsCovered": ["JavaScript", "DOM Manipulation", "Event Handling", "localStorage"],
      "microSkills": [
        "Event listeners (click, input)",
        "DOM element creation & manipulation",
        "Array methods (map, filter, splice)",
        "localStorage API",
        "JSON stringify/parse",
        "ES6 template literals",
        "Function closures",
        "Error handling",
        "CSS class toggling"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-web-003",
      "title": "Master CSS Grid & Flexbox Layouts",
      "objective": "Create a complex dashboard-style UI using CSS Grid and Flexbox. Build multiple responsive card layouts and navigation menus.",
      "skillsCovered": ["CSS", "Flexbox", "CSS Grid", "Layout Design"],
      "microSkills": [
        "Flexbox properties (justify-content, align-items)",
        "CSS Grid template areas",
        "Auto-fit and auto-fill properties",
        "Gap and spacing control",
        "Responsive breakpoints",
        "CSS custom properties (variables)",
        "Gradient backgrounds",
        "Shadow and border effects"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    },
    {
      "id": "quest-web-004",
      "title": "Build a Weather App with API Integration",
      "objective": "Create a weather application that fetches real-time data from a public API and displays it dynamically.",
      "skillsCovered": ["JavaScript", "REST APIs", "Async/Await", "JSON"],
      "microSkills": [
        "Fetch API basics",
        "Async/await syntax",
        "Error handling with try-catch",
        "JSON parsing",
        "API key management",
        "Dynamic DOM updates",
        "Date formatting",
        "User input handling"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-web-005",
      "title": "Learn React Basics & Build Components",
      "objective": "Dive into React.js and create reusable components, manage state, and handle user interactions.",
      "skillsCovered": ["React", "JSX", "State Management", "Props"],
      "microSkills": [
        "JSX syntax and rendering",
        "Functional components",
        "useState hook",
        "Props drilling",
        "Event handling in React",
        "Conditional rendering",
        "List rendering with map()",
        "Component composition"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 6
    }
  ],
  embedded: [
    {
      "id": "quest-emb-001",
      "title": "Build a LED Blink Program",
      "objective": "Write a C program to control an LED on a microcontroller using GPIO pins. Learn basic digital output control.",
      "skillsCovered": ["C", "Embedded C", "Microcontrollers"],
      "microSkills": [
        "Register manipulation",
        "Bit shifting operations",
        "GPIO configuration",
        "Output pin control",
        "Delay functions",
        "Preprocessor directives",
        "Header file usage",
        "Basic C syntax on embedded",
        "Serial debugging setup"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 2
    },
    {
      "id": "quest-emb-002",
      "title": "Read Sensor Data with Microcontroller",
      "objective": "Program a microcontroller to read analog sensor input (temperature, light) and display results.",
      "skillsCovered": ["Embedded C", "ADC", "Microcontrollers", "Sensors"],
      "microSkills": [
        "ADC (Analog-to-Digital Converter) setup",
        "Voltage reference configuration",
        "Reading analog pins",
        "Data conversion and scaling",
        "Serial communication output",
        "Timing and sampling rates",
        "Calibration techniques",
        "Error checking"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    },
    {
      "id": "quest-emb-003",
      "title": "Master UART Serial Communication",
      "objective": "Implement UART protocol to communicate between a microcontroller and a computer.",
      "skillsCovered": ["UART", "Embedded C", "Serial Communication"],
      "microSkills": [
        "UART register configuration",
        "Baud rate setup",
        "Transmit and receive functions",
        "Interrupt handling",
        "Buffer management",
        "Parity and stop bits",
        "String transmission",
        "Debug logging over UART"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-emb-004",
      "title": "Implement PWM for LED Brightness Control",
      "objective": "Use PWM (Pulse Width Modulation) to control LED brightness dynamically.",
      "skillsCovered": ["PWM", "Embedded C", "Microcontrollers"],
      "microSkills": [
        "PWM register configuration",
        "Duty cycle control",
        "Frequency settings",
        "Timer setup",
        "Interrupt-driven PWM",
        "Real-time adjustments",
        "Testing and debugging",
        "Power consumption optimization"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    },
    {
      "id": "quest-emb-005",
      "title": "Build an I2C Communication System",
      "objective": "Master I2C protocol to communicate with sensors and peripherals.",
      "skillsCovered": ["I2C", "Embedded C", "Communication Protocols"],
      "microSkills": [
        "I2C protocol fundamentals",
        "Master/Slave configuration",
        "SCL/SDA pin control",
        "Address assignment",
        "Start and stop conditions",
        "Data transmission sequences",
        "Error handling and ACK/NACK",
        "Multi-device systems"
      ],
      "difficulty": "Advanced",
      "estimatedHours": 5
    }
  ],
  python: [
    {
      "id": "quest-py-001",
      "title": "Python Fundamentals & Data Types",
      "objective": "Master Python syntax, variables, data types, and basic operations.",
      "skillsCovered": ["Python", "Variables", "Data Types", "Control Flow"],
      "microSkills": [
        "Variables and naming conventions",
        "Strings, integers, floats, booleans",
        "Type conversion",
        "Operators (arithmetic, logical, comparison)",
        "Control flow (if/else, loops)",
        "String manipulation",
        "List and dictionary basics",
        "Functions definition and calling"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 3
    },
    {
      "id": "quest-py-002",
      "title": "Object-Oriented Programming in Python",
      "objective": "Learn OOP concepts: classes, inheritance, polymorphism, and encapsulation.",
      "skillsCovered": ["Python", "OOP", "Classes", "Inheritance"],
      "microSkills": [
        "Class definition and instantiation",
        "Instance and class variables",
        "Methods and self parameter",
        "Constructors and destructors",
        "Inheritance hierarchies",
        "Method overriding",
        "Polymorphism concepts",
        "Encapsulation and access modifiers"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-py-003",
      "title": "Data Analysis with Pandas & NumPy",
      "objective": "Learn data manipulation, cleaning, and analysis using Python libraries.",
      "skillsCovered": ["Pandas", "NumPy", "Data Analysis", "Python"],
      "microSkills": [
        "NumPy arrays and operations",
        "Pandas DataFrames",
        "CSV file reading/writing",
        "Data filtering and selection",
        "Grouping and aggregation",
        "Missing data handling",
        "Statistical calculations",
        "Data visualization basics"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 5
    },
    {
      "id": "quest-py-004",
      "title": "Build a REST API with Flask",
      "objective": "Create a complete REST API using Flask framework with proper routing and error handling.",
      "skillsCovered": ["Flask", "REST APIs", "Backend", "Python"],
      "microSkills": [
        "Flask app setup and routing",
        "HTTP methods (GET, POST, PUT, DELETE)",
        "Request and response handling",
        "JSON serialization",
        "Error handling and status codes",
        "Database integration basics",
        "CORS and middleware",
        "Testing and debugging APIs"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 6
    }
  ],
  generic: [
    {
      "id": "quest-gen-001",
      "title": "Master Version Control with Git",
      "objective": "Learn Git fundamentals: commits, branches, merging, and collaboration.",
      "skillsCovered": ["Git", "Version Control", "Collaboration"],
      "microSkills": [
        "Git initialization and configuration",
        "Staging and committing changes",
        "Branching strategies",
        "Merging and conflict resolution",
        "Remote repositories",
        "Pull requests workflow",
        "Git history and rebasing",
        "Collaboration best practices"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 2
    },
    {
      "id": "quest-gen-002",
      "title": "Command Line Mastery",
      "objective": "Become proficient with terminal/command line for your development workflow.",
      "skillsCovered": ["Terminal", "CLI", "Bash", "Command Line"],
      "microSkills": [
        "File and directory navigation",
        "File operations (create, copy, move, delete)",
        "File permissions and ownership",
        "Environment variables",
        "Piping and redirection",
        "Package managers (npm, pip, apt)",
        "Scripting basics",
        "Debugging command errors"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 3
    }
  ]
};

// Function 1: Generate Roadmap
const generateRoadmap = async (missingSkills) => {
  try {
    const roadmapType = detectSkillCategory(missingSkills);
    return mockRoadmaps[roadmapType] || mockRoadmaps.generic;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return mockRoadmaps.generic;
  }
};

// Function 2: Generate Quests
const generateQuests = async (missingSkills) => {
  try {
    const skillCategory = detectSkillCategory(missingSkills);
    const quests = mockQuestLibrary[skillCategory] || mockQuestLibrary.web;
    return quests;
  } catch (error) {
    console.error("Error generating quests:", error);
    return mockQuestLibrary.web;
  }
};

// Helper function: Detect skill category based on scoring algorithm
const detectSkillCategory = (missingSkills = []) => {
  if (!Array.isArray(missingSkills)) return 'generic';

  const skillsLower = missingSkills.map(s => s.toLowerCase());

  // Web Development
  const webSkills = ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'rest api', 'apis', 'git'];
  // Embedded Systems
  const embeddedSkills = ['c', 'embedded c', 'microcontroller', 'uart', 'spi', 'i2c', 'rtos', 'pointer'];
  // Python / Data Science
  const pythonSkills = ['python', 'sql', 'pandas', 'numpy', 'data', 'analytics', 'excel', 'visualization'];
  // Mobile
  const mobileSkills = ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react native'];

  const webMatches = skillsLower.filter(s => webSkills.some(w => s.includes(w))).length;
  const embeddedMatches = skillsLower.filter(s => embeddedSkills.some(e => s.includes(e))).length;
  const pythonMatches = skillsLower.filter(s => pythonSkills.some(p => s.includes(p))).length;
  const mobileMatches = skillsLower.filter(s => mobileSkills.some(m => s.includes(m))).length;

  if (embeddedMatches >= webMatches && embeddedMatches >= pythonMatches && embeddedMatches >= mobileMatches && embeddedMatches > 0) return 'embedded';
  if (pythonMatches >= webMatches && pythonMatches >= embeddedMatches && pythonMatches >= mobileMatches && pythonMatches > 0) return 'python';
  if (mobileMatches >= webMatches && mobileMatches > 0) return 'web'; // Use web for mobile fallback
  return 'web';
};

// Function 3: Extract Skills from Resume
const extractSkillsFromResume = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Extract all technical skills mentioned in this resume text. Return as a JSON array of strings.
      Return only the JSON array, no markdown or extra text.
      Example: ["JavaScript", "React", "Node.js", "SQL"]

      Resume text:
      ${pdfText}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = cleanJsonResponse(text);
    const skills = JSON.parse(cleaned);
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.warn("Error extracting skills from resume:", error.message);
    return [];
  }
};

// Function 4: Chat with Aroha - IMPROVED WITH SMART RESPONSES
const askAroha = async (question, user) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are Aroha, a friendly and encouraging career/coding mentor chatbot.

      Here is what you know about the student you're talking to:
      - Name: ${user.name}
      - Target role: ${user.targetRole}
      - Current skills: ${Array.isArray(user.currentSkills) ? user.currentSkills.join(', ') : 'unknown'}
      - Missing skills: ${Array.isArray(user.missingSkills) ? user.missingSkills.join(', ') : 'unknown'}
      - Readiness score: ${typeof user.readinessScore === 'number' ? user.readinessScore : 'unknown'}%

      The student asked:
      "${question}"

      Answer clearly and concisely (2-3 sentences max, plain text — no markdown, no lists, no code fences), tailoring your advice specifically to their target role and current skill gaps. Be conversational and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    if (response && response.length > 10) {
      return response;
    } else {
      throw new Error('Empty response from API');
    }
  } catch (error) {
    console.warn("⚠️ Gemini API unavailable, using smart mock response:", error.message);
    return generateSmartMockResponse(question, user);
  }
};

// IMPROVED Smart Mock Response Generator with 15+ question patterns
const generateSmartMockResponse = (question, user) => {
  const questionLower = question.toLowerCase().trim();
  const nextSkill = user.missingSkills && user.missingSkills.length > 0 ? user.missingSkills[0] : 'your chosen skills';
  const targetRole = user.targetRole || 'your target role';
  const currentSkillsList = user.currentSkills && user.currentSkills.length > 0 ? user.currentSkills.slice(0, 3).join(', ') : 'your current skills';
  const readiness = user.readinessScore || 0;
  const userName = user.name || 'there';

  // Priority-based pattern matching (most specific first)
  
  // Time-based learning questions
  if (questionLower.match(/how long|how much time|time to learn|learning curve/i)) {
    const skillName = nextSkill.toLowerCase();
    const hours = skillName.includes('c') || skillName.includes('embedded') ? '40-60 hours' : '20-30 hours';
    return `To master ${nextSkill}, expect around ${hours} of focused practice. However, with Aroha's structured quests and microskills breakdown, you'll see progress much faster! Most learners start seeing results within the first week.`;
  }

  // Difficulty and feasibility
  if (questionLower.match(/difficult|hard|challenging|tough|easy|doable/i)) {
    return `${nextSkill} might seem intimidating at first, but it's totally learnable! We break it down into bite-sized microskills so you can master each piece gradually. You already know ${currentSkillsList}, so you have a solid foundation. Trust the process! 💪`;
  }

  // Motivation and encouragement
  if (questionLower.match(/motivation|encourage|inspire|believe|confidence|doubt/i)) {
    const motivationMsg = readiness >= 60 ? `You're ${readiness}% ready already—that's incredible progress!` : `Every expert started exactly where you are now.`;
    return `${motivationMsg} The fact that you're here learning shows real commitment. Complete each quest step by step, and before you know it, you'll be ready for your ${targetRole} role. You've got this! 🚀`;
  }

  // Job and career prospects
  if (questionLower.match(/job|hiring|company|salary|career|opportunity|employment|interview/i)) {
    return `Companies are actively hiring ${targetRole}s who know ${currentSkillsList}. Once you master ${nextSkill}, your readiness will jump from ${readiness}% to ${Math.min(readiness + 20, 100)}%+. Build a portfolio through our quests, and you'll be interview-ready soon!`;
  }

  // Learning path and roadmap
  if (questionLower.match(/roadmap|path|journey|what's next|next step|learning order|sequence/i)) {
    return `Your ${targetRole} learning path is structured perfectly! You've mastered ${currentSkillsList}—great foundation! Next, tackle ${nextSkill} through our quests, then gradually build up to advanced skills. Follow the roadmap step by step, and you'll reach 100% readiness.`;
  }

  // Microskills and quest details
  if (questionLower.match(/microskill|micro-skill|breakdown|detailed|what will i learn|quest detail/i)) {
    return `Each quest breaks down into microskills—tiny, focused lessons that teach one concept at a time. For ${nextSkill}, you'll learn things like fundamentals, best practices, and real-world applications. This structure makes complex topics super manageable!`;
  }

  // Badges and gamification
  if (questionLower.match(/badge|achievement|reward|gamification|unlock|reward system/i)) {
    return `Badges are awesome! You earn them by completing quests and mastering microskills. They're not just fun—they prove your skills to employers and keep you motivated. Your first badge is just around the corner at ${readiness}% readiness!`;
  }

  // Portfolio and resume
  if (questionLower.match(/portfolio|resume|project|showcase|build|proof/i)) {
    return `Every quest you complete adds a real project to your portfolio! Document what you built, the challenges you overcame, and what you learned. Combined with your ${readiness}% readiness score, a solid portfolio makes you irresistible to recruiters.`;
  }

  // Resources and learning materials
  if (questionLower.match(/resource|material|reference|documentation|book|course|tutorial|guide/i)) {
    return `Aroha provides everything you need right here! Each quest includes step-by-step guidance, links to documentation, and community tips. We curate the best free resources so you're not lost in information overload. Focus on completing quests—that's the fastest path to mastery!`;
  }

  // Specific skill questions (HTML, React, C, Python, etc.)
  if (questionLower.includes('html') || questionLower.includes('css') || questionLower.includes('react')) {
    return `Web development is an amazing choice! Start with HTML fundamentals, master CSS layouts, then dive into JavaScript and React. Our quests guide you through each step with hands-on projects. You'll go from beginner to ${targetRole}-ready in no time!`;
  }

  if (questionLower.includes('c') || questionLower.includes('embedded') || questionLower.includes('microcontroller')) {
    return `Embedded systems is powerful stuff! C fundamentals are crucial, then move to pointers, microcontrollers, and communication protocols. Each quest teaches real hardware concepts. You're building skills for high-demand jobs—keep grinding! 🔧`;
  }

  if (questionLower.includes('python') || questionLower.includes('data') || questionLower.includes('sql')) {
    return `Python is perfect for data science and backend work! Start with basics, then move to libraries like Pandas and NumPy. Our quests include real-world datasets so you build actual data analysis skills. Perfect for becoming a ${targetRole}!`;
  }

  // Readiness score questions
  if (questionLower.match(/readiness|score|progress|percentage|how ready/i)) {
    const scoreMsg = readiness >= 80 ? `You're nearly job-ready! Just finish the last few skills.`
                   : readiness >= 60 ? `You're past the halfway point! Keep pushing through the remaining quests.`
                   : readiness >= 40 ? `You've got solid momentum. Stay consistent and your score will climb fast!`
                   : `You're building a strong foundation. Complete more quests to see big score jumps!`;
    return `Your readiness score is ${readiness}%. ${scoreMsg} Remember, each completed quest boosts your readiness—you're on the right track, ${userName}!`;
  }

  // Stuck or having problems
  if (questionLower.match(/stuck|problem|help|error|not working|confused|understand/i)) {
    return `When you get stuck, break the problem into smaller pieces! Review the microskill again, try searching for specific error messages, and experiment. Remember, debugging is a skill too. If you're really stuck, move to another microskill and come back later.`;
  }

  // Default response - encouraging and personalized
  return `Great question, ${userName}! Based on your ${targetRole} goal and your current readiness of ${readiness}%, I'd recommend focusing on ${nextSkill} next. It's one of the most important skills for your role. Start a quest, and you'll gain hands-on experience. Keep going—you're building an amazing career! 💡`;
};

// Export all functions
module.exports = {
  generateRoadmap,
  generateQuests,
  extractSkillsFromResume,
  askAroha
};