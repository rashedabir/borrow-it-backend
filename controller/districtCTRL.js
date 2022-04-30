const District = require("../model/districtModel");

const DistrictCTRL = {
  getDistrict: async (req, res) => {
    try {
      const categories = await District.find({ division_id: req.params.id });
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createDistrict: async (req, res) => {
    try {
      const district = req.body;
      district.forEach(async (element) => {
        const newDistrict = new District(element);
        await newDistrict.save();
      });

      res.json("Added");
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDistrict: async (req, res) => {
    try {
      await District.findByIdAndDelete(req.params.id);
      res.json({ msg: "District Deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = DistrictCTRL;
