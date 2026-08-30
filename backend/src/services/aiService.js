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

// ===== COMPREHENSIVE MOCK DATA =====

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
    { "id": "quest-web-001", "title": "Build a Responsive Portfolio Website", "objective": "Create a personal portfolio using HTML, CSS, and JavaScript. Include projects section, about me, and contact form. Make it mobile-responsive.", "skillsCovered": ["HTML", "CSS", "JavaScript", "Responsive Design"], "difficulty": "Beginner", "estimatedHours": 5 },
    { "id": "quest-web-002", "title": "Create an Interactive Todo App", "objective": "Build a fully functional todo list with add, delete, edit, and mark-complete features using vanilla JavaScript and localStorage.", "skillsCovered": ["JavaScript", "DOM Manipulation", "Event Handling", "localStorage"], "difficulty": "Intermediate", "estimatedHours": 4 },
    { "id": "quest-web-003", "title": "Master CSS Grid & Flexbox Layouts", "objective": "Create a complex dashboard-style UI using CSS Grid and Flexbox. Build multiple responsive card layouts and navigation menus.", "skillsCovered": ["CSS", "Flexbox", "CSS Grid", "Layout Design"], "difficulty": "Intermediate", "estimatedHours": 3 },
    { "id": "quest-web-004", "title": "Build a React E-Commerce App", "objective": "Create a shopping app with product listing, cart functionality, and checkout. Use React hooks and state management.", "skillsCovered": ["React", "JavaScript", "Component Design", "State Management"], "difficulty": "Advanced", "estimatedHours": 8 },
    { "id": "quest-web-005", "title": "API Integration Project", "objective": "Build a weather or movie app that fetches data from a public API. Display results dynamically and handle errors gracefully.", "skillsCcovered": ["JavaScript", "APIs", "Fetch/Axios", "Error Handling"], "difficulty": "Intermediate", "estimatedHours": 4 }
  ],
  embedded: [
    { "id": "quest-emb-001", "title": "Build a LED Blink Program", "objective": "Write a C program to control an LED on a microcontroller using GPIO pins. Learn basic digital output control.", "skillsCovered": ["C", "Embedded C", "Microcontrollers"], "difficulty": "Beginner", "estimatedHours": 2 },
    { "id": "quest-emb-002", "title": "Implement a Timer Interrupt Handler", "objective": "Create a timer-based interrupt handler on a microcontroller. Understand interrupts and real-time event handling.", "skillsCovered": ["Embedded C", "Microcontrollers", "RTOS"], "difficulty": "Intermediate", "estimatedHours": 4 },
    { "id": "quest-emb-003", "title": "Master UART Communication", "objective": "Implement UART protocol to enable serial communication between a microcontroller and a computer. Debug using serial output.", "skillsCcovered": ["UART", "SPI", "I2C", "Embedded C"], "difficulty": "Intermediate", "estimatedHours": 3 },
    { "id": "quest-emb-004", "title": "Build a Digital Thermometer", "objective": "Interface a temperature sensor with a microcontroller. Read analog values, convert to temperature, and display on LCD.", "skillsCovered": ["Embedded C", "ADC", "I2C", "Sensor Integration"], "difficulty": "Intermediate", "estimatedHours": 5 },
    { "id": "quest-emb-005", "title": "Create a Motor Control System", "objective": "Control a DC motor using PWM. Implement speed control and direction reversal.", "skillsCcovered": ["PWM", "Microcontrollers", "Embedded C"], "difficulty": "Intermediate", "estimatedHours": 4 }
  ],
  python: [
    { "id": "quest-py-001", "title": "Build a Data Analysis Project", "objective": "Analyze a dataset using Pandas. Create visualizations with Matplotlib and generate insights from data.", "skillsCovered": ["Python", "Pandas", "Data Analysis", "Visualization"], "difficulty": "Beginner", "estimatedHours": 4 },
    { "id": "quest-py-002", "title": "Create a REST API with Flask", "objective": "Build a REST API with Flask. Implement CRUD operations, error handling, and test with Postman.", "skillsCovered": ["Python", "Flask", "REST API", "Backend Development"], "difficulty": "Intermediate", "estimatedHours": 5 },
    { "id": "quest-py-003", "title": "Web Scraping & Automation", "objective": "Build a web scraper using Beautiful Soup. Extract data from a website and automate periodic scraping tasks.", "skillsCovered": ["Python", "Web Scraping", "Automation"], "difficulty": "Intermediate", "estimatedHours": 3 },
    { "id": "quest-py-004", "title": "Machine Learning Basics", "objective": "Build a simple ML model using scikit-learn. Train, test, and evaluate a classification or regression model.", "skillsCcovered": ["Python", "Machine Learning", "scikit-learn"], "difficulty": "Intermediate", "estimatedHours": 6 },
    { "id": "quest-py-005", "title": "Build a Chatbot", "objective": "Create a chatbot using Natural Language Processing. Process user input and generate intelligent responses.", "skillsCovered": ["Python", "NLP", "NLTK"], "difficulty": "Advanced", "estimatedHours": 7 }
  ],
  mobile: [
    { "id": "quest-mob-001", "title": "Build Your First App", "objective": "Create a simple mobile app with multiple screens, navigation, and basic data storage.", "skillsCovered": ["React Native", "JavaScript", "Mobile Development"], "difficulty": "Beginner", "estimatedHours": 5 },
    { "id": "quest-mob-002", "title": "Implement Authentication", "objective": "Add user login, signup, and session management to a mobile app.", "skillsCovered": ["Authentication", "JWT", "Firebase"], "difficulty": "Intermediate", "estimatedHours": 4 },
    { "id": "quest-mob-003", "title": "Location-Based Features", "objective": "Integrate GPS and maps into your app. Build a location-tracking feature.", "skillsCcovered": ["Geolocation", "Maps API", "Mobile Development"], "difficulty": "Intermediate", "estimatedHours": 3 }
  ],
  generic: [
    { "id": "quest-gen-001", "title": "Complete a Foundational Tutorial", "objective": "Work through an official tutorial or course for your target skill. Build the example project from scratch.", "skillsCovered": ["Fundamentals", "Practice"], "difficulty": "Beginner", "estimatedHours": 3 },
    { "id": "quest-gen-002", "title": "Build a Small Project", "objective": "Create a small but complete project combining all the skills you're learning.", "skillsCcovered": ["Integration", "Problem Solving"], "difficulty": "Intermediate", "estimatedHours": 4 },
    { "id": "quest-gen-003", "title": "Contribute to Open Source", "objective": "Find an open-source project and make your first meaningful contribution.", "skillsCcovered": ["Collaboration", "Git", "Open Source"], "difficulty": "Intermediate", "estimatedHours": 5 }
  ]
};

// Helper: Detect skill category from skills array
function detectSkillCategory(missingSkills) {
  if (!missingSkills || missingSkills.length === 0) return 'generic';
  
  const skillsLower = missingSkills.map(s => s.toLowerCase()).join(' ');
  
  if (skillsLower.includes('html') || skillsLower.includes('css') || skillsLower.includes('react') || skillsLower.includes('vue') || skillsLower.includes('javascript')) {
    return 'web';
  }
  if (skillsLower.includes('embedded') || skillsLower.includes('microcontroller') || skillsLower.includes('uart') || skillsLower.includes('gpio') || skillsLower.includes('rtos')) {
    return 'embedded';
  }
  if (skillsLower.includes('python') || skillsLower.includes('flask') || skillsLower.includes('django') || skillsLower.includes('data') || skillsLower.includes('pandas')) {
    return 'python';
  }
  if (skillsLower.includes('react native') || skillsLower.includes('swift') || skillsLower.includes('kotlin') || skillsLower.includes('flutter')) {
    return 'mobile';
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

// Function 2: Generate Quests (NOW SMART!)
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
        "difficulty": "Beginner or Intermediate",
        "estimatedHours": 5
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("⚠️ Gemini API unavailable, using smart mock quests:", error.message);
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