import { useAuth } from "../../context/AuthContext";

const WelcomeCard = () => {
  const { user } = useAuth();

  const currentHour = new Date().getHours();

  let greeting = "Good Evening";

  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 17) greeting = "Good Afternoon";

  return (
    <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-3xl p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold">
        {greeting}, {user?.name}
      </h1>

      <p className="mt-2 text-purple-100">
        Organize your learning, track progress,
        and stay on top of your deadlines.
      </p>
    </div>
  );
};

export default WelcomeCard;