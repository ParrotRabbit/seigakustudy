静学 v4 — 改用 Vercel 部署（无需 Render）

开始之前
- 用 MacBook 解压静学_可直接部署Vercel_v4.zip。
- 先准备一个 GitHub 账户及 Vercel 账户。可以尝试通过 GitHub 登录 Vercel。
- 预备 OpenAI API Key；绝对不要将密钥放入 GitHub、对话或网页源码。
- 本项目有 AI 服务端，不能只把 public 文件夹交给 Netlify Drop。

步骤 1：上传 GitHub
1. 打开 https://github.com/new ，创建 PRIVATE 私人仓库，如 seigaku-study。
2. 点 Add file → Upload files。
3. 进入 ZIP 解压后的 静学_可直接部署Vercel_v4 文件夹，上传里面的文件及其文件夹（public、api、lib、package.json、vercel.json 等）；注意是上传里面的内容，而不是把父文件夹作为仓库子目录。
4. 提交 Commit changes；检查仓库根目录可见 public、api、lib、package.json、vercel.json。
5. 不要上传 .env 或自己的私人笔记。

步骤 2：Vercel 部署
1. 打开 https://vercel.com ，选择 Continue with GitHub 登录。
2. Add New → Project → Import Git Repository → 选择 seigaku-study。
3. Framework Preset 选 Other（或自动识别）。Root Directory 保持 ./。
4. 在 Environment Variables 设置：
   OPENAI_API_KEY = 你在 OpenAI API 平台得到的真实 API Key
   APP_PASSWORD = 自己设置的至少 12 位的独立强密码（不是 OpenAI 密码）
   OPENAI_MODEL = gpt-4.1-mini （可选）
5. Deployment Environment 至少勾选 Production；点击 Deploy。
6. Vercel 给你 https://xxx.vercel.app 的网址。打开网址，状态应显示 AI 辅导已连接。

步骤 3：第一次提问
1. 在网页右上角点击 ⚙，填入你刚才设置的 APP_PASSWORD，保存。
2. 发送「～わけではない的接续、语感和例句」。
3. 得到详细 AI 答疑才能算接入成功。状态指示灯亮并不代表真正回答测试成功。
4. iPad Safari 打开该网址 → 分享 → 添加到主屏幕。学习时无需打开 MacBook。

问题排查
- 404：检查仓库根目录是否真有 public/、api/、lib/ 文件夹；根目录不要多嵌套一层。
- AI 尚未连接：Vercel Project → Settings → Environment Variables 中检查 OPENAI_API_KEY，修改后重新 Deploy。
- 401：网页右上角 ⚙ 设置填写的密码必须与 Vercel APP_PASSWORD 完全一致。
- 503：没有密钥，或 APP_PASSWORD 不满 12 位。
- 413：文件过大；先把截图裁剪到单个段落，音频尽量缩短到约 2 MB 以内。
- 超时或 500：Vercel → 项目 → Logs 查看函数错误，再检查 OpenAI API 项目余额/权限。
- 如果一次性上传 GitHub 失败，可以用 GitHub Desktop 上传并提交。

费用与限制
- Vercel Hobby 免费方案只适合个人非商业使用，有配额限制。
- OpenAI API 另行计费，ChatGPT Plus 不包含它的使用量。
- Vercel Functions 的 HTTP 请求最大约 4.5 MB：此版会在 iPad 上压缩较大的图片，音频约 2MB 上限，不适合上传很长的音频。
- 笔记、复习卡当前只保存在当前设备，不跨 iPad / Mac 自动同步。
- 服务端使用两次模型调用（先判断是否学习问题、再回答），会增加少量费用；话题控制并非绝对无法绕过。
- 无论如何勿公开分享你的 APP_PASSWORD；临时实例的限速不足以作为强制计费保护。

本地检查（可选）
使用 Node.js 22+，进入项目目录运行 npm run dev，浏览器访问 http://localhost:3000/。
本地测试若不配置环境变量不会产生 API 费用。

官方文档
https://vercel.com/docs/functions/runtimes/node-js
https://vercel.com/docs/projects/managing-projects
https://vercel.com/docs/environment-variables/managing-environment-variables
https://vercel.com/docs/errors/function_payload_too_large
