import React from "react";
import { RefreshCw, ChevronsRight, ChevronsLeft } from "lucide-react";

const HeatMap = ({ heatmap, onRefresh, isLoading, isExpanded, onToggleExpand }) => {

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
        <div className="bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 h-full flex flex-col">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Activity Heatmap
                </h2>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-[#625df5]/10 hover:bg-[#625df5]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh heatmap data"
                    >
                        <RefreshCw
                            size={18}
                            className={`text-[#625df5] ${isLoading ? "animate-spin" : ""}`}
                        />
                    </button>
                    {onToggleExpand && (
                        <button
                            onClick={onToggleExpand}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                            title={isExpanded ? "Collapse" : "Expand"}
                        >
                            {isExpanded ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
                        </button>
                    )}
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-2">
                        <span>Less</span>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-gray-100 dark:bg-[#1a1f2e]"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-[#10b981]/20"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-[#10b981]/40"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-[#10b981]/70"></div>
                        <div className="w-[10px] h-[10px] rounded-[2px] bg-[#10b981]"></div>
                        <span>More</span>
                    </div>
                </div>

            </div>

            <div className={`flex overflow-x-auto pb-2 ${isExpanded ? "justify-center" : ""} scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>

                <div className={`min-w-max flex gap-2 ${isExpanded ? 'gap-4' : 'gap-2'}`}>

                    {/* Day labels */}

                    <div className={`flex flex-col text-[10px] text-gray-500 font-medium py-[1px] mt-6 ${isExpanded ? 'gap-[4px]' : 'gap-[2px]'}`}>

                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'}`}>Sun</span>
                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'} opacity-0`}>Mon</span>
                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'}`}>Tue</span>
                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'} opacity-0`}>Wed</span>
                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'}`}>Thu</span>
                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'} opacity-0`}>Fri</span>
                        <span className={`${isExpanded ? 'h-[12px]' : 'h-[10px]'}`}>Sat</span>

                    </div>

                    {/* Months */}

                    <div className={`flex ${isExpanded ? 'gap-[10px]' : 'gap-[6px]'}`}>

                        {monthsData.map((month, mIndex) => {

                            const cells = [];

                            const firstDay = month.days[0].getDay();
                            
                            const cellSize = isExpanded ? "12px" : "10px";
                            const cellClass = isExpanded ? "w-[12px] h-[12px]" : "w-[10px] h-[10px]";

                            for (let i = 0; i < firstDay; i++) {
                                cells.push(<div key={`empty-${i}`} className={cellClass} />);
                            }

                            month.days.forEach((d) => {

                                const key =
                                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

                                const count = activity[key] || 0;

                                let bgColor = "bg-gray-100 dark:bg-[#1a1f2e]";

                                if (count === 1) bgColor = "bg-[#10b981]/20";
                                else if (count === 2) bgColor = "bg-[#10b981]/40";
                                else if (count === 3) bgColor = "bg-[#10b981]/70";
                                else if (count >= 4) bgColor = "bg-[#10b981]";

                                cells.push(
                                    <div
                                        key={key}
                                        title={`${count} submissions on ${key}`}
                                        className={`${cellClass} rounded-[2px] ${bgColor} hover:ring-2 hover:ring-gray-500 transition-all cursor-pointer`}
                                    />
                                );
                            });

                            return (

                                <div key={mIndex} className="flex flex-col gap-1 items-start">

                                    <span className={`text-xs text-gray-500 dark:text-gray-400 h-5 ${isExpanded ? 'ml-1' : ''}`}>
                                        {month.name}
                                    </span>

                                    <div
                                        className={`grid ${isExpanded ? 'gap-[4px]' : 'gap-[2px]'}`}
                                        style={{
                                            gridTemplateRows: `repeat(7, ${cellSize})`,
                                            gridAutoFlow: "column",
                                            gridAutoColumns: cellSize
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