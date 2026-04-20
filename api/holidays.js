const { HOLIDAYS, getShanghaiDate } = require('./lib');

module.exports = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const now = getShanghaiDate();
            const dateStr = now.toISOString().split('T')[0];
            const isTodayHoliday = HOLIDAYS.includes(dateStr);
            return res.status(200).json({
                holidays: HOLIDAYS,
                today: dateStr,
                isTodayHoliday,
                nextHoliday: HOLIDAYS.find(d => d > dateStr) || null
            });
        }

        if (req.method === 'POST') {
            const { action, date } = req.body;
            if (!action || !date) {
                return res.status(400).json({ error: 'Missing action or date' });
            }
            if (req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            if (action === 'add') {
                if (!HOLIDAYS.includes(date)) {
                    HOLIDAYS.push(date);
                    HOLIDAYS.sort();
                }
                return res.status(200).json({ message: 'Added: ' + date, holidays: HOLIDAYS });
            }
            if (action === 'remove') {
                const index = HOLIDAYS.indexOf(date);
                if (index > -1) HOLIDAYS.splice(index, 1);
                return res.status(200).json({ message: 'Removed: ' + date, holidays: HOLIDAYS });
            }
            return res.status(400).json({ error: 'Invalid action' });
        }
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
