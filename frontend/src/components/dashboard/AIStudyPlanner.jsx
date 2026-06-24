const AIStudyPlanner = ({ aiPlan }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        AI Study Planner
      </h2>

      <div className="space-y-3">
        {aiPlan?.map((item, index) => (
          <div
            key={index}
            className="bg-purple-50 p-4 rounded-xl"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIStudyPlanner;