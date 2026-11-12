# 夜栖 GitHub Pages 部署

- 仓库 [suiyue228/yeqi](https://github.com/suiyue228/yeqi)
- 正式开发分支 `main`
- 网站 [夜栖 · 月下树洞](https://suiyue228.github.io/yeqi/)
- 首次发布的应用版本 `c67df10`，部署配置在后续提交中

## 原开发目录首次同步

在原开发目录运行 `git status --short` 和 `git fetch origin`。用 `git diff --name-only HEAD origin/main` 查看远程带来的文件变更。如果当前分支为 `main`、本地未提交文件与远程变更没有重叠，运行 `git merge --ff-only origin/main`。这次首次同步预期只带来部署文件和插画路径适配。

如果快进被拒绝，先在原开发对话中检查重叠文件或已经分叉的提交。保存现有工作后再合并 `origin/main`，逐项检查冲突。

## 更新与手动部署

1. 在原开发目录继续开发。使用 Node.js 24 和 `package.json` 指定的 pnpm 版本，运行 `pnpm install --frozen-lockfile`、`pnpm test` 和 `pnpm build`。
2. 在 `main` 提交本次要发布的源码和资源，运行 `git push origin main`。推送会触发 [Deploy to GitHub Pages](https://github.com/suiyue228/yeqi/actions/workflows/deploy.yml)。
3. 等待构建与发布两个任务成功，然后打开网站验证本次改动。

手动重发时，在 GitHub 的 **Actions → Deploy to GitHub Pages → Run workflow** 中选择 `main`。工作流从 Pages 设置读取站点路径，使用锁文件安装依赖，构建并发布 `dist/`。

## 故障排查

- 工作流未启动时，检查提交是否已推送到 `main`，并确认 **Settings → Pages → Source** 选择 **GitHub Actions**。
- 构建失败时，展开 Actions 中失败的步骤。用 `pnpm install --frozen-lockfile` 和 `pnpm run build --base /yeqi/` 复现安装或构建错误。
- 发布失败时，检查 `github-pages` 环境和 Pages 来源设置。发布成功但出现资源 404 时，在浏览器 Network 中检查请求是否带 `/yeqi/` 前缀，并核对文件名大小写。
- 页面直接访问使用带 `#` 的路由，例如 [纸艺小剧场](https://suiyue228.github.io/yeqi/#/theatre)。

## 回退

在 `main` 用 `git log --oneline` 找到要撤销的应用提交，执行 `git revert <提交哈希>`，验证后运行 `git push origin main`。如需撤销多个应用提交，从新到旧逐个撤销。保留 Pages 工作流和资源路径适配，回退提交同样会触发发布。

## 本地记录

信笺、草稿、心愿与收藏索引保存在当前浏览器的 `localStorage`。线上域名使用独立存储，`localhost` 中的记录留在原浏览器存储里。设备和浏览器之间各自保存记录。JSON 导出含私人内容，应留在本地。
