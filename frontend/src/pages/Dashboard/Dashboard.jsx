import { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import OverviewCards from "../../components/dashboard/OverviewCards";
import UpcomingTasks from "../../components/dashboard/UpcomingTasks";
import AIStudyPlanner from "../../components/dashboard/AIStudyPlanner";
import QuickNotes from "../../components/dashboard/QuickNotes";
import CalendarWidget from "../../components/dashboard/CalendarWidget";
import WeeklyPerformance from "../../components/dashboard/WeeklyPerformance";
import { getDashboardData } from "../../services/dashboardService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    overview: { groupsJoined: 0, questsCompleted: 0, studyRoomsJoined: 0 },
    tasks: [],
    notes: [],
    aiPlan: [],
    calendarEvents: [],
    weeklyPerformance: [],
  });

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboardData();
      setDashboardData({
        overview: data.overview || {},
        tasks: data.tasks || [],
        notes: data.notes || [],
        aiPlan: data.aiPlan || [],
        calendarEvents: data.calendarEvents || [],
        weeklyPerformance: data.weeklyPerformance || [],
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <Layout>
      <div className="p-8 space-y-6">
        <WelcomeCard />
        <OverviewCards overview={dashboardData.overview} />
        <div className="grid lg:grid-cols-2 gap-6">
          <UpcomingTasks tasks={dashboardData.tasks} />
          <AIStudyPlanner aiPlan={dashboardData.aiPlan} />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <QuickNotes
            notes={dashboardData.notes}
            refresh={fetchDashboard}
          />
          <CalendarWidget events={dashboardData.calendarEvents} />
        </div>
        <WeeklyPerformance data={dashboardData.weeklyPerformance} />
      </div>
    </Layout>
  );
};

export default Dashboard;