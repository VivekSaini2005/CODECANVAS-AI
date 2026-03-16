import React from "react";

const HeatMap = ({ heatmap }) => {

    const today = new Date();

    const startDate = new Date();
    startDate.setDate(today.getDate() - 365);

    const activity = {};

    // Convert API response → activity map
    heatmap?.forEach((item) => {
        activity[item.date] = item.count;
    });

    const monthsData = [];
    let currentMonthKey = "";

    for (let i = 0; i <= 365; i++) {

        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);

        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;

        if (currentMonthKey !== monthKey) {

            currentMonthKey = monthKey;

            monthsData.push({
                name: d.toLocaleString("default", { month: "short" }),
                year: d.getFullYear(),
                month: d.getMonth(),
                days: []
            });
        }

        monthsData[monthsData.length - 1].days.push(new Date(d));
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Activity Heatmap
                </h2>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Less</span>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-gray-100 dark:bg-gray-700/50"></div>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-green-200 dark:bg-green-900/60"></div>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-green-300 dark:bg-green-700/80"></div>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-green-400 dark:bg-green-500"></div>
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-green-500 dark:bg-green-400"></div>
                    <span>More</span>
                </div>

            </div>

            <div className="flex overflow-x-auto pb-2 custom-scrollbar">

                <div className="min-w-max flex gap-2">

                    {/* Day labels */}

                    <div className="flex flex-col gap-[2px] text-[10px] text-gray-500 dark:text-gray-400 font-medium py-[1px] mt-6">

                        <span className="h-[10px]">Sun</span>
                        <span className="h-[10px] opacity-0">Mon</span>
                        <span className="h-[10px]">Tue</span>
                        <span className="h-[10px] opacity-0">Wed</span>
                        <span className="h-[10px]">Thu</span>
                        <span className="h-[10px] opacity-0">Fri</span>
                        <span className="h-[10px]">Sat</span>

                    </div>

                    {/* Months */}

                    <div className="flex gap-[6px]">

                        {monthsData.map((month, mIndex) => {

                            const cells = [];

                            const firstDay = month.days[0].getDay();

                            for (let i = 0; i < firstDay; i++) {
                                cells.push(<div key={`empty-${i}`} className="w-[10px] h-[10px]" />);
                            }

                            month.days.forEach((d) => {

                                const key =
                                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

                                const count = activity[key] || 0;

                                let bgColor = "bg-gray-100 dark:bg-gray-700/50";

                                if (count === 1) bgColor = "bg-green-200 dark:bg-green-900/60";
                                else if (count === 2) bgColor = "bg-green-300 dark:bg-green-700/80";
                                else if (count === 3) bgColor = "bg-green-400 dark:bg-green-500";
                                else if (count >= 4) bgColor = "bg-green-500 dark:bg-green-400";

                                cells.push(
                                    <div
                                        key={key}
                                        title={`${count} submissions on ${key}`}
                                        className={`w-[10px] h-[10px] rounded-[2px] ${bgColor} hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500 transition-all cursor-pointer`}
                                    />
                                );
                            });

                            return (

                                <div key={mIndex} className="flex flex-col gap-1 items-center">

                                    <span className="text-xs text-gray-500 dark:text-gray-400 h-5">
                                        {month.name}
                                    </span>

                                    <div
                                        className="grid gap-[2px]"
                                        style={{
                                            gridTemplateRows: "repeat(7, 10px)",
                                            gridAutoFlow: "column",
                                            gridAutoColumns: "10px"
                                        }}
                                    >
                                        {cells}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeatMap;