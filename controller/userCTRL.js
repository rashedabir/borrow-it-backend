const User = require("../model/userModel");
const Product = require("../model/productModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCTRL = {
  register: async (req, res) => {
    try {
      const { name, email, password, rePassword } = req.body;

      if (!name || !email || !password || !rePassword) {
        return res.status(400).json({ msg: "Invalid Creadentials." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "This User Already Exists." });
      }
      if (password.length < 4) {
        return res
          .status(400)
          .json({ msg: "Password must be 4 lengths long." });
      }
      if (password !== rePassword) {
        return res.status(400).json({ msg: "Password Doesn't Match." });
      }
      const hashPass = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashPass,
      });

      await newUser.save();
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: async (req, res) => {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token) {
      return res.status(400).json({ msg: "Please Login or Register." });
    }
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, admin) => {
      if (err) {
        return res.status(400).json({ msg: "Please Login or Register." });
      }
      const accessToken = createAccessToken({ id: admin.id });

      res.json({ accessToken });
    });
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ msg: "Invalid Creadential." });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User Doesn't Exists." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect Password." });
      }

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: "none",
      });
      return res.json({ msg: "Logged Out" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ msg: "User Doesn't Exists." });
      }
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  productList: async (req, res) => {
    try {
      const products = await Product.find({ user: req.user.id });
      res.json(products);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const user = await User.findOne({ _id: req.user.id });
      if (!user) {
        return res.status(400).json({ msg: "User not Found" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Current Password not Matched" });
      }
      if (newPassword.length < 4) {
        return res.status(400).json({ msg: "Password must be 4 Lengths Long" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: "Password Doesn't Match" });
      }
      const hashPass = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: hashPass,
        }
      );
      res.json({ msg: "Password Changed." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCTRL;
