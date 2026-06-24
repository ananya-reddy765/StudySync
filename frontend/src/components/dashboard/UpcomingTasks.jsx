const UpcomingTasks = ({ tasks }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        Upcoming Tasks & Deadlines
      </h2>

      <div className="space-y-3">
        {tasks?.length ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-slate-50 rounded-xl"
            >
              <h3 className="font-semibold">
                {task.title}
              </h3>

              <p className="text-sm text-gray-500">
                Due:
                {" "}
                {new Date(
                  task.dueDate
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingTasks;