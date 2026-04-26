import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      isActive: user.isActive,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
  });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, company, profileImage } = req.body;

  let user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name || req.user.name,
      phone: phone || req.user.phone,
      company: company || req.user.company,
      profileImage: profileImage || req.user.profileImage,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
});
