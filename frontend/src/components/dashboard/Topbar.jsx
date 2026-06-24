const Topbar = () => {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Welcome back to StudySync
        </p>
      </div>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="
            px-4
            py-3
            rounded-xl
            bg-white
            border
            border-slate-200
            text-slate-700
            outline-none
          "
        />

        <div
          className="
            w-10
            h-10
            rounded-full
            bg-purple-600
            text-white
            flex
            items-center
            justify-center
            font-semibold
          "
        >
          A
        </div>

      </div>

    </div>
  );
};

export default Topbar;