const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all">
      
      <div className="flex items-center justify-between">
        
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-1">
            {value}
          </h2>
        </div>

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-lg">
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;