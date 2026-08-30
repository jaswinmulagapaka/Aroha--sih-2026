
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
        "Responsive grid columns",
        "Gap & margin handling",
        "CSS custom properties (variables)",
        "Responsive typography",
        "Mobile menu toggle",
        "Nested flexbox/grid",
        "CSS calc() function"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    },
    {
      "id": "quest-web-004",
      "title": "Build a React E-Commerce App",
      "objective": "Create a shopping app with product listing, cart functionality, and checkout. Use React hooks and state management.",
      "skillsCovered": ["React", "JavaScript", "Component Design", "State Management"],
      "microSkills": [
        "React functional components",
        "useState & useEffect hooks",
        "Props drilling",
        "Component composition",
        "Conditional rendering",
        "Lists & keys",
        "Form handling in React",
        "Context API basics",
        "Array/object state updates",
        "React DevTools"
      ],
      "difficulty": "Advanced",
      "estimatedHours": 8
    },
    {
      "id": "quest-web-005",
      "title": "API Integration Project",
      "objective": "Build a weather or movie app that fetches data from a public API. Display results dynamically and handle errors gracefully.",
      "skillsCovered": ["JavaScript", "APIs", "Fetch/Axios", "Error Handling"],
      "microSkills": [
        "Fetch API syntax",
        "Async/await",
        "Promise handling",
        "API authentication (API keys)",
        "JSON response parsing",
        "Error handling (try/catch)",
        "Loading states",
        "HTTP status codes",
        "CORS understanding",
        "API documentation reading"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
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
      "title": "Implement a Timer Interrupt Handler",
      "objective": "Create a timer-based interrupt handler on a microcontroller. Understand interrupts and real-time event handling.",
      "skillsCovered": ["Embedded C", "Microcontrollers", "RTOS"],
      "microSkills": [
        "Interrupt setup & configuration",
        "ISR (Interrupt Service Routine)",
        "Timer prescaler settings",
        "Volatile keyword usage",
        "Critical sections",
        "Interrupt priorities",
        "Context switching basics",
        "Timer overflow handling",
        "Debugging interrupts"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-emb-003",
      "title": "Master UART Communication",
      "objective": "Implement UART protocol to enable serial communication between a microcontroller and a computer. Debug using serial output.",
      "skillsCovered": ["UART", "SPI", "I2C", "Embedded C"],
      "microSkills": [
        "UART initialization",
        "Baud rate configuration",
        "Transmit/receive functions",
        "Circular buffers",
        "Serial terminal usage",
        "Debugging with printf",
        "Data frame format",
        "Error checking (parity)",
        "Interrupt-driven UART"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    },
    {
      "id": "quest-emb-004",
      "title": "Build a Digital Thermometer",
      "objective": "Interface a temperature sensor with a microcontroller. Read analog values, convert to temperature, and display on LCD.",
      "skillsCovered": ["Embedded C", "ADC", "I2C", "Sensor Integration"],
      "microSkills": [
        "ADC (Analog-to-Digital Converter)",
        "Voltage-to-temperature conversion",
        "I2C communication protocol",
        "Sensor calibration",
        "Data smoothing (averaging)",
        "LCD interfacing",
        "Sensor datasheets reading",
        "Pull-up resistor configuration",
        "Multi-byte data handling"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 5
    },
    {
      "id": "quest-emb-005",
      "title": "Create a Motor Control System",
      "objective": "Control a DC motor using PWM. Implement speed control and direction reversal.",
      "skillsCovered": ["PWM", "Microcontrollers", "Embedded C"],
      "microSkills": [
        "PWM (Pulse Width Modulation)",
        "Duty cycle calculation",
        "Frequency selection",
        "Motor driver interfacing",
        "H-bridge basics",
        "Speed regulation",
        "Direction control (GPIO)",
        "Power supply considerations",
        "Protection circuits"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    }
  ],
  python: [
    {
      "id": "quest-py-001",
      "title": "Build a Data Analysis Project",
      "objective": "Analyze a dataset using Pandas. Create visualizations with Matplotlib and generate insights from data.",
      "skillsCovered": ["Python", "Pandas", "Data Analysis", "Visualization"],
      "microSkills": [
        "DataFrames & Series",
        "CSV file reading",
        "Data filtering & sorting",
        "Groupby operations",
        "Statistical calculations",
        "Matplotlib plotting",
        "Chart types (line, bar, scatter)",
        "Data cleaning",
        "Missing data handling"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 4
    },
    {
      "id": "quest-py-002",
      "title": "Create a REST API with Flask",
      "objective": "Build a REST API with Flask. Implement CRUD operations, error handling, and test with Postman.",
      "skillsCovered": ["Python", "Flask", "REST API", "Backend Development"],
      "microSkills": [
        "Flask app initialization",
        "HTTP methods (GET, POST, PUT, DELETE)",
        "Route decorators",
        "Request/response handling",
        "JSON serialization",
        "Error handling & status codes",
        "CORS handling",
        "Environment variables",
        "API testing with Postman",
        "Documentation (docstrings)"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 5
    },
    {
      "id": "quest-py-003",
      "title": "Web Scraping & Automation",
      "objective": "Build a web scraper using Beautiful Soup. Extract data from a website and automate periodic scraping tasks.",
      "skillsCovered": ["Python", "Web Scraping", "Automation"],
      "microSkills": [
        "HTML parsing with Beautiful Soup",
        "CSS selectors",
        "Requests library usage",
        "Data extraction patterns",
        "CSV file writing",
        "Scheduling with APScheduler",
        "User-agent headers",
        "Rate limiting",
        "Error handling & retries"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    },
    {
      "id": "quest-py-004",
      "title": "Machine Learning Basics",
      "objective": "Build a simple ML model using scikit-learn. Train, test, and evaluate a classification or regression model.",
      "skillsCovered": ["Python", "Machine Learning", "scikit-learn"],
      "microSkills": [
        "Dataset splitting (train/test)",
        "Feature scaling & normalization",
        "Scikit-learn algorithms",
        "Model training",
        "Prediction making",
        "Accuracy metrics",
        "Confusion matrix",
        "Cross-validation",
        "Hyperparameter tuning"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 6
    },
    {
      "id": "quest-py-005",
      "title": "Build a Chatbot",
      "objective": "Create a chatbot using Natural Language Processing. Process user input and generate intelligent responses.",
      "skillsCovered": ["Python", "NLP", "NLTK"],
      "microSkills": [
        "NLTK library basics",
        "Tokenization",
        "Stemming & lemmatization",
        "Intent classification",
        "Pattern matching",
        "Response generation",
        "Chat state management",
        "Training data preparation",
        "Evaluation metrics"
      ],
      "difficulty": "Advanced",
      "estimatedHours": 7
    }
  ],
  mobile: [
    {
      "id": "quest-mob-001",
      "title": "Build Your First App",
      "objective": "Create a simple mobile app with multiple screens, navigation, and basic data storage.",
      "skillsCovered": ["React Native", "JavaScript", "Mobile Development"],
      "microSkills": [
        "React Native setup",
        "Components & styles",
        "Navigation stack",
        "Props & state",
        "Touch handlers",
        "AsyncStorage",
        "Platform-specific code",
        "Debugging tools",
        "Build & run on device"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 5
    },
    {
      "id": "quest-mob-002",
      "title": "Implement Authentication",
      "objective": "Add user login, signup, and session management to a mobile app.",
      "skillsCovered": ["Authentication", "JWT", "Firebase"],
      "microSkills": [
        "Firebase setup",
        "User registration",
        "Email verification",
        "JWT tokens",
        "Session management",
        "Password hashing",
        "Secure storage",
        "Auth state persistence",
        "Error handling"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-mob-003",
      "title": "Location-Based Features",
      "objective": "Integrate GPS and maps into your app. Build a location-tracking feature.",
      "skillsCovered": ["Geolocation", "Maps API", "Mobile Development"],
      "microSkills": [
        "Permissions handling",
        "Geolocation API",
        "GPS coordinates",
        "Google Maps integration",
        "Map markers & clustering",
        "Distance calculations",
        "Background location tracking",
        "Location accuracy",
        "Battery optimization"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 3
    }
  ],
  generic: [
    {
      "id": "quest-gen-001",
      "title": "Complete a Foundational Tutorial",
      "objective": "Work through an official tutorial or course for your target skill. Build the example project from scratch.",
      "skillsCovered": ["Fundamentals", "Practice"],
      "microSkills": [
        "Following documentation",
        "Hands-on coding",
        "Debugging",
        "Testing",
        "Best practices",
        "Code organization",
        "Version control basics",
        "Environment setup"
      ],
      "difficulty": "Beginner",
      "estimatedHours": 3
    },
    {
      "id": "quest-gen-002",
      "title": "Build a Small Project",
      "objective": "Create a small but complete project combining all the skills you're learning.",
      "skillsCovered": ["Integration", "Problem Solving"],
      "microSkills": [
        "Planning & design",
        "Requirements gathering",
        "Implementation",
        "Testing & debugging",
        "Code review",
        "Documentation",
        "Performance optimization",
        "User feedback incorporation"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 4
    },
    {
      "id": "quest-gen-003",
      "title": "Contribute to Open Source",
      "objective": "Find an open-source project and make your first meaningful contribution.",
      "skillsCovered": ["Collaboration", "Git", "Open Source"],
      "microSkills": [
        "Repository forking",
        "Git workflow",
        "Code conventions",
        "Pull requests",
        "Code review process",
        "Community communication",
        "Issue resolution",
        "License understanding"
      ],
      "difficulty": "Intermediate",
      "estimatedHours": 5
    }
  ]
};

// Helper: Detect skill category from skills array (SMART VERSION)
function detectSkillCategory(missingSkills) {
  if (!missingSkills || missingSkills.length === 0) return 'generic';
  
  const skillsLower = missingSkills.map(s => s.toLowerCase());
  const skillsText = skillsLower.join(' ');
  
  // Score each category
  let scores = { web: 0, embedded: 0, python: 0, mobile: 0, generic: 0 };
  
  // Web development keywords
  const webKeywords = ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript', 'webpack', 'npm', 'nodejs', 'express', 'bootstrap', 'tailwind', 'frontend', 'web design', 'ajax', 'dom'];
  webKeywords.forEach(kw => {
    if (skillsText.includes(kw)) scores.web += 2;
  });
  
  // Embedded systems keywords
  const embeddedKeywords = ['embedded', 'microcontroller', 'uart', 'gpio', 'rtos', 'i2c', 'spi', 'pwm', 'adc', 'arm', 'avr', 'stm32', 'arduino', 'firmware', 'bare metal', 'hardware'];
  embeddedKeywords.forEach(kw => {
    if (skillsText.includes(kw)) scores.embedded += 3;
  });
  
  // Python keywords
  const pythonKeywords = ['python', 'flask', 'django', 'pandas', 'numpy', 'matplotlib', 'sklearn', 'tensorflow', 'keras', 'data science', 'machine learning', 'ml', 'ai', 'nltk'];
  pythonKeywords.forEach(kw => {
    if (skillsText.includes(kw)) scores.python += 2;
  });
  
  // Mobile keywords
  const mobileKeywords = ['react native', 'swift', 'kotlin', 'flutter', 'android', 'ios', 'mobile', 'app development', 'expo'];
  mobileKeywords.forEach(kw => {
    if (skillsText.includes(kw)) scores.mobile += 3;
  });
  
  // Generic C/C++ that could be embedded
  if ((skillsText.includes('c') || skillsText.includes('c++') || skillsText.includes('c programming')) && scores.embedded === 0) {
    scores.embedded += 1;
  }
  
  // Find the highest score
  const highestScore = Math.max(scores.web, scores.embedded, scores.python, scores.mobile);
  
  if (highestScore === 0) return 'generic';
  
  // Return category with highest score
  for (const [category, score] of Object.entries(scores)) {
    if (score === highestScore) return category;
  }
  
  return 'generic';
}

// ===== API FUNCTIONS WITH SMART FALLBACK =====

// Function 1: Generate Roadmap
const generateRoadmap = async (missingSkills) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Act as a senior engineering mentor. Your student needs to learn these specific skills: ${missingSkills.join(', ')}.
      
      Create a sequential learning roadmap.
      
      You must return ONLY a raw JSON array containing exactly 5 objects. Do not include markdown formatting, backticks, or conversational text.
      Each object must strictly adhere to this schema:
      {
        "stepNumber": 1,
        "title": "A concise step title",
        "description": "Exactly one sentence explaining what to focus on in this step."
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("⚠️ Gemini API unavailable, using smart mock roadmap:", error.message);
    const category = detectSkillCategory(missingSkills);
    return mockRoadmaps[category];
  }
};

// Function 2: Generate Quests (NOW WITH MICROSKILLS!)
const generateQuests = async (missingSkills) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Act as an expert engineering mentor. Your student needs to learn these missing skills: ${missingSkills.join(', ')}.
      
      Generate exactly 3 project-based quests to help them master these specific skills.
      
      You must return ONLY a raw JSON array containing exactly 3 objects. Do not include markdown formatting, backticks, or conversational text.
      Each object must strictly adhere to this schema:
      {
        "id": "A unique string (e.g., quest-123)",
        "title": "A concise, action-oriented title",
        "objective": "1-2 sentences describing exactly what the student will build.",
        "skillsCovered": ["Skill A", "Skill B"],
        "microSkills": ["Micro skill 1", "Micro skill 2", "Micro skill 3"],
        "difficulty": "Beginner or Intermediate",
        "estimatedHours": 5
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("⚠️ Gemini API unavailable, using smart mock quests with microskills:", error.message);
    const category = detectSkillCategory(missingSkills);
    return mockQuestLibrary[category].slice(0, 3);
  }
};

// Function 3: Extract Skills from Resume
const extractSkillsFromResume = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Extract the technical skills (e.g., C, Python, React, Git, Data Analysis) from the following resume text.
      
      You must return ONLY a raw JSON array containing strings of the extracted skills. Do not include markdown formatting, backticks, or conversational text.
      Example format: ["C", "Python", "React", "Git"]
      
      Resume Text:
      ${pdfText}
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("⚠️ Gemini API unavailable, using generic skills fallback:", error.message);
    return ["C", "Python", "JavaScript", "Git", "Problem Solving"];
  }
};

// Function 4: Chat with Aroha
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

      Answer clearly and concisely (a few sentences, plain text — no markdown formatting, no code fences), tailoring your advice to their target role and skill gaps.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.warn("⚠️ Gemini API unavailable, using mock response:", error.message);
    const nextSkill = user.missingSkills && user.missingSkills.length > 0 ? user.missingSkills[0] : 'your chosen skills';
    return `Hi ${user.name}! I'm Aroha, your personal career mentor. I see you're aiming for a ${user.targetRole} role—that's awesome! You've made great progress so far. Keep focused on mastering ${nextSkill}, and you'll be well on your way. What would you like to learn next?`;
  }
};

// Export all functions
module.exports = {
  generateRoadmap,
  generateQuests,
  extractSkillsFromResume,
  askAroha
};