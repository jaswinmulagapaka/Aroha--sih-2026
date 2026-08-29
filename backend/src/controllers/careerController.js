const careersData = require('../data/careers');

const getAllCareers = (req, res) => {
  try {
    const careerNames = Object.keys(careersData);
    res.status(200).json({ careers: careerNames });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCareerByName = (req, res) => {
  try {
    const careerName = req.params.careerName;
    const career = careersData[careerName];

    if (!career) {
      return res.status(404).json({ 
        error: "Career not found", 
        message: `No data available for '${careerName}'. Please check the spelling.` 
      });
    }

    res.status(200).json({
      career: careerName,
      requiredSkills: career.requiredSkills
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllCareers,
  getCareerByName
};