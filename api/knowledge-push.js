const { WECOM_WEBHOOK_URL, isHoliday, getShanghaiDate, sendTextToWeCom } = require('./lib');

module.exports = async (req, res) => {
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        if (isHoliday()) {
            const dateStr = getShanghaiDate().toISOString().split('T')[0];
            return res.status(200).json({ message: 'Holiday, skip push', date: dateStr });
        }
        const knowledgeContent = {
            industry_watchtower: [
                '1. Google Gemini Robotics-ER 1.6',
                '2. AI warehouse robot traffic MIT Symbotic',
                '3. VAGEN Stanford RL visual language model'
            ],
            internal_know_how: [
                '1. AI coding share replay',
                '2. Skill center platform'
            ],
            team_logbook: ['Welcome!']
        };
        const dateStr = getShanghaiDate().toISOString().split('T')[0].replace(/-/g, '.');
        let text = 'Knowledge Map ' + dateStr + ' Vol.3';
        knowledgeContent.industry_watchtower.forEach(item => { text += item + '\n'; });
        await sendTextToWeCom(WECOM_WEBHOOK_URL, text);
        return res.status(200).json({ message: 'Push success', date: dateStr });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
