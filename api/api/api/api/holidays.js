const { HOLIDAYS, getShanghaiDate } = require('./lib');

module.exports = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const now = getShanghaiDate();
            const dateStr = now.toISOString().split('T')[0];
            return res.status(200).json({
                holidays: HOLIDAYS,
                today: dateStr,
                isTodayHoliday: HOLIDAYS.includes(dateStr),
                nextHoliday: HOLIDAYS.find(d => d > dateStr) || '暂无'
            });
        }

        if (req.method === 'POST') {
            const { action, date } = req.body;
            if (!action || !date) {
                return res.status(400).json({ error: '缺少 action 或 date 参数' });
            }
            if (req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (action === 'add') {
                if (!HOLIDAYS.includes(date)) {
                    HOLIDAYS.push(date);
                    HOLIDAYS.sort();
                }
                return res.status(200).json({ message: `已添加节假日: ${date}`, holidays: HOLIDAYS });
            }

            if (action === 'remove') {
                const index = HOLIDAYS.indexOf(date);
                if (index > -1) HOLIDAYS.splice(index, 1);
                return res.status(200).json({ message: `已移除节假日: ${date}`, holidays: HOLIDAYS });
            }

            return res.status(400).json({ error: '无效的 action，支持 add 或 remove' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
