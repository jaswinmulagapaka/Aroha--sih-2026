// src/data/careers.js
//
// Single source of truth for career → required-skills mappings.
// Other backend modules (routes/controllers/services) should import this
// instead of hardcoding skill lists, so we only ever update skills in one place.

const careers = {
  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "Git",
    "React",
    "REST APIs"
  ],
  "Embedded Systems Engineer": [
    "C",
    "Pointers",
    "Embedded C",
    "Microcontrollers",
    "UART",
    "SPI",
    "I2C",
    "RTOS"
  ],
  "Data Analyst": [
    "Python",
    "SQL",
    "Excel",
    "Statistics",
    "Pandas",
    "Data Visualization"
  ]
};

module.exports = careers;
