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
        <div className="glass border border-gray-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 h-full flex flex-col shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex justify-between items-center mb-8">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <RefreshCw size={20} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Activity Heatmap
                    </h2>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Refresh heatmap data"
                    >
                        <RefreshCw
                            size={18}
                            className={`text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform ${isLoading ? "animate-spin" : ""}`}
                        />
                    </button>
                    {onToggleExpand && (
                        <button
                            onClick={onToggleExpand}
                            className="p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all hover:scale-110"
                            title={isExpanded ? "Collapse" : "Expand"}
                        >
                            {isExpanded ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
                        </button>
                    )}
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] font-semibold text-gray-400 ml-4 tracking-wide uppercase px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <span>Less</span>
                        <div className="flex items-center gap-1.5 mx-1">
                            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-white/5"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#0e4429] border border-white/5"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#006d32] border border-white/5"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#26a641] border border-white/5"></div>
                            <div className="w-3 h-3 rounded-sm bg-[#39d353] border border-white/5 shadow-[0_0_8px_rgba(57,211,83,0.3)]"></div>
                        </div>
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

                                let bgColor = "bg-gray-100 dark:bg-[#161b22] border-gray-200 dark:border-white/5";

                                if (count === 1) bgColor = "bg-[#0e4429] border-white/5";
                                else if (count === 2) bgColor = "bg-[#006d32] border-white/5";
                                else if (count === 3) bgColor = "bg-[#26a641] border-white/5";
                                else if (count >= 4) bgColor = "bg-[#39d353] border-white/5 shadow-[0_0_8px_rgba(57,211,83,0.3)]";

                                cells.push(
                                    <div
                                        key={key}
                                        title={`${count} submissions on ${key}`}
                                        className={`${cellClass} rounded-sm border ${bgColor} hover:scale-[1.25] hover:z-10 hover:shadow-md hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200 cursor-pointer`}
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