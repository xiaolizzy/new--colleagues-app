const { WECOM_WEBHOOK_URL, isHoliday, getShanghaiDate, sendTextToWeCom } = require('./lib');

module.exports = async (req, res) => {
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (isHoliday()) {
            const dateStr = getShanghaiDate().toISOString().split('T')[0];
            return res.status(200).json({ message: '节假日，跳过推送', date: dateStr });
        }

        const knowledgeContent = {
            industry_watchtower: [
                "1. Google 发布 Gemini Robotics-ER 1.6，号称\"迄今最安全的机器人模型\"",
                "链接：https://www.theverge.com/ai-artificial-intelligence/912231/spot-the-robot-can-now-read-gauges",
                "2. AI系统优化仓库机器人交通流量，MIT与Symbotic合作开发混合系统",
                "链接：https://news.mit.edu/2026/ai-system-keeps-warehouse-robot-traffic-running-smoothly-0326",
                "3. VAGEN: 斯坦福提出用强化学习训练视觉语言模型构建世界模型",
                "链接：https://ai.stanford.edu/blog/vagen/"
            ],
            internal_know_how: [
                "1. 群核AI coding分享回放合集：https://cf.qunhequnhe.com/pages/viewpage.action?pageId=81410810612",
                "2. 群核skill中心平台已上线：https://coops.qunhequnhe.com/ai/skill#/"
            ],
            team_logbook: [
                "欢迎一翔加入工具产品部！"
            ]
        };

        const dateStr = getShanghaiDate().toISOString().split('T')[0].replace(/-/g, '.');
        let text = `🧭 Landing知识地图 | ${dateStr} / Vol.3\n\n持续学习，与团队共成长 🚀\n\n`;
        text += `🔭 行业瞭望塔\n`;
        knowledgeContent.industry_watchtower.forEach(item => { text += `• ${item}\n`; });
        text += `\n📖 内部武功秘籍\n`;
        knowledgeContent.internal_know_how.forEach(item => { text += `• ${item}\n`; });
        text += `\n🧭 团队航海日志\n`;
        knowledgeContent.team_logbook.forEach(item => { text += `• ${item}\n`; });
        text += `\nLanding护航，共鸣成长 • 工具产品部/make团队出品`;

        await sendTextToWeCom(WECOM_WEBHOOK_URL, text);
        return res.status(200).json({ message: '知识地图推送成功', date: dateStr });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
