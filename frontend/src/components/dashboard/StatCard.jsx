const StatCard = ({ title, value, icon, change, isPositive = true }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/90 hover:shadow-md hover:border-purple-200 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 tracking-tight">
            {value}
          </h2>
        </div>

        {icon && (
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 text-xl border border-purple-100 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              isPositive ? "text-green-600" : "text-red-500"
            }`}
          >
            {isPositive ? "+" : ""}{change}
          </span>
          <span className="text-gray-400">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;