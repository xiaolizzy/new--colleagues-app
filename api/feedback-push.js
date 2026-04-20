const { FEEDBACK_WEBHOOK_URL, isHoliday, getShanghaiDate, sendTextToWeCom } = require('./lib');

module.exports = async (req, res) => {
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        if (isHoliday()) {
            const dateStr = getShanghaiDate().toISOString().split('T')[0];
            return res.status(200).json({ message: '节假日，跳过推送', date: dateStr });
        }
        const text = '一周过去啦，跟我聊聊你的心情吧～\n\n👉 [点击这里开始填写](https://xiaolizzy.github.io/new--colleagues-app/)\n\n(P.S. 如果链接提示不安全，请放心点击，这是内部链接，可以安全填写哦)';
        await sendTextToWeCom(FEEDBACK_WEBHOOK_URL, text);
        return res.status(200).json({ message: '心情收集推送成功' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
