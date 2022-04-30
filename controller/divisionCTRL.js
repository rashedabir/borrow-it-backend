const Division = require("../model/divisionModel");

const divisionCTRL = {
  getDivision: async (req, res) => {
    try {
      const categories = await Division.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createDivision: async (req, res) => {
    try {
      const division = req.body;
      division.forEach(async (element) => {
        const newDivision = new Division(element);
        await newDivision.save();
      });

      res.json("Added");
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDivision: async (req, res) => {
    try {
      await Division.findByIdAndDelete(req.params.id);
      res.json({ msg: "Division Deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = divisionCTRL;
