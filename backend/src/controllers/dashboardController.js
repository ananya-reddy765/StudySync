import dashboardService from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const dashboardData = await dashboardService.getDashboardData(userId);
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};