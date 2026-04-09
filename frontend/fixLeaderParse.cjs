const fs = require('fs');
let c = fs.readFileSync('src/pages/Leaderboard.jsx', 'utf8');

c = c.replace(
  />\s*<div>\s*<div className="min-w-0 flex-1">\s*<div className="font-[^>]*>\s*\{user\.name\}\s*<\/div>\s*<\/div>/g,
  '>\n                                        <div className="min-w-0 flex-1">\n                                            <div className="font-medium text-sm transition-colors hover:text-indigo-400 cursor-pointer truncate max-w-[120px] sm:max-w-xs md:max-w-none">\n                                                {user.name}\n                                            </div>\n                                        </div>\n                                    </div>'
);

fs.writeFileSync('src/pages/Leaderboard.jsx', c);
