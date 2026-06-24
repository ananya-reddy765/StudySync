import { Link } from "react-router-dom";

const AuthLayout = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* LEFT SIDE */}

        <div className="flex flex-col justify-center px-16 xl:px-24">

          <Link
            to="/"
            className="text-4xl font-bold mb-12"
          >
            Study
            <span className="text-purple-500">
              Sync
            </span>
          </Link>

          <h1 className="text-5xl xl:text-6xl font-bold leading-tight max-w-xl">
            Study Together,

            <span className="block text-purple-500">
              Learn Better,
            </span>

            Grow Together.
          </h1>

          <p className="mt-8 text-gray-300 text-lg max-w-xl leading-relaxed">
            StudySync brings the library study-group
            experience online, helping students
            collaborate, learn and grow together.
          </p>

          {/* FEATURES */}

          <div className="mt-12 max-w-xl">

            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8">

              <h3 className="text-2xl font-bold mb-6">
                What You Can Do With StudySync
              </h3>

              <div className="space-y-5">

                <div className="flex items-start gap-4">

                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>

                  <div>
                    <h4 className="font-semibold">
                      Create & Join Study Groups
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">
                      Connect with students studying
                      the same subjects.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>

                  <div>
                    <h4 className="font-semibold">
                      Attend Virtual Study Rooms
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">
                      Collaborate through chat,
                      whiteboards and discussions.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>

                  <div>
                    <h4 className="font-semibold">
                      Share Learning Resources
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">
                      Upload notes, PDFs and study
                      materials with your groups.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>

                  <div>
                    <h4 className="font-semibold">
                      Learn Through Quests
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">
                      Practice concepts with quizzes
                      and interactive learning paths.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>

                  <div>
                    <h4 className="font-semibold">
                      Track Your Learning Journey
                    </h4>

                    <p className="text-gray-400 text-sm mt-1">
                      Visualize progress,
                      achievements and milestones
                      over time.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center p-8">

          <div
            className="
              w-full
              max-w-xl
              bg-slate-800
              border
              border-slate-700
              rounded-3xl
              p-12
              shadow-2xl
            "
          >
            <h2 className="text-4xl font-bold">
              {title}
            </h2>

            <p className="text-gray-400 mt-3 mb-10">
              {subtitle}
            </p>

            {children}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;