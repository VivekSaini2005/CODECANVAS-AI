const fs = require('fs');
let file = fs.readFileSync('src/pages/SolveProblem.jsx', 'utf8');

file = file.replace(
  '<div ref={containerRef} className="flex flex-1 overflow-hidden select-none">',
  '<div ref={containerRef} className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden select-none">'
);

file = file.replace(
  '<div className="border-r border-gray-200 dark:border-[#1e2332] flex flex-col overflow-hidden" style={{ width: \\%\ }}>',
  '<div className="w-full lg:w-auto h-[60vh] lg:h-full shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-[#1e2332] flex flex-col overflow-hidden" style={{ width: typeof window !== \'undefined\' && window.innerWidth >= 1024 ? \\%\ : undefined }}>'
);

file = file.replace(
  '<div\n          className="w-1.5 flex-shrink-0 bg-gray-200 dark:bg-[#1e2332] hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 flex items-center justify-center group"\n          onMouseDown={handleMouseDown}\n        >',
  '<div\n          className="hidden lg:flex w-1.5 flex-shrink-0 bg-gray-200 dark:bg-[#1e2332] hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 items-center justify-center group"\n          onMouseDown={handleMouseDown}\n        >'
);

file = file.replace(
  '<div className="flex-1 flex flex-col overflow-hidden">',
  '<div className="flex-1 flex flex-col overflow-hidden min-h-[500px] lg:min-h-0">'
);

if(file.includes('bg-white dark:bg-[#121622] flex-shrink-0"')) {
    file = file.replace(
      'bg-white dark:bg-[#121622] flex-shrink-0">',
      'bg-white dark:bg-[#121622] flex-shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide">'
    );
}

fs.writeFileSync('src/pages/SolveProblem.jsx', file);
console.log('SolveProblem updated');
