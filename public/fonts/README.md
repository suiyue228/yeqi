# 本地字体资源

本项目的字体随网站同源提供，不调用外部字体服务，不发送用户正文。字体不是本项目原创作品；新增标题的组合排版与矢量饰线为本项目原创。

## 来源与许可

- 展示字：璇玑造字 **朱雀仿宋 v0.212**，官方包 https://github.com/TrionesType/zhuque/releases/tag/v0.212 ，下载 https://github.com/TrionesType/zhuque/releases/download/v0.212/ZhuqueFangsong-v0.212.zip 。原TTF SHA256：558c62730844fe54ba220146ed62f859d4e2880188d92d985f8921c6e3743bc4。上游为技术预览版，本项目仅采用已经检查的界面中文字形；不把它当作覆盖所有用户输入的正文字库。版权和SIL OFL 1.1全文见OFL-Zhuque.txt。
- 手写字：LXGW与Nozomi Seto的 **小赖 Xiaolai v3.126**，官方 https://github.com/lxgw/kose-font ，下载 https://github.com/lxgw/kose-font/releases/download/v3.126/Xiaolai-Regular.ttf 。SIL OFL 1.1全文及上游版权见OFL-Xiaolai.txt；具体原文件SHA256、分片SHA256与字形数见manifest.json。
- 许可允许随软件嵌入和再分发；保留上述完整许可与版权，不单独销售字体，不声称字体作者为本项目背书。分片、格式转换及内部名称改为Moonlit Display / Moonlit Hand，不修改字形轮廓；衍生字体仍为OFL 1.1。
- 普通界面使用设备的PingFang SC / Microsoft YaHei等系统字体，英文辅助用Georgia等系统衬线字体，不在仓库分发这些商业系统字库。

## 分片与维护

仅发布WOFF2；原始TTF/候选字体不进入public或Git。display为当前源码中实际界面字与标点的子集；hand保留原字体全部Unicode映射，按字符分组，unicode-range使浏览器只读取当前文字所需分片，罕见字出现时再读取对应文件。不是只保留演示句子的“假中文字体”。缺少的扩展汉字、emoji由系统字库回退。

所有字体使用font-display:swap；字体未到达或失败时先显示可读文字，不锁住输入或等待字体才挂载页面。字体不随页面切换重建，已读资源由浏览器缓存。不要预加载整套中文字体。

可选维护脚本scripts/build-fonts.py需要Python、fonttools 4.65.0、brotli 1.2.1；日常启动、构建不需要Python。取得上方版本的原字体后执行：

```sh
python -m pip install fonttools==4.65.0 brotli==1.2.1
python scripts/build-fonts.py --display /path/ZhuqueFangsong-Regular.ttf --hand /path/Xiaolai-Regular.ttf
```

脚本扫描src的真实界面字符、生成src/fonts.css及manifest，逐分片重新打开校验映射；不把用户浏览器的日记用于子集化。新增固定标题后应重新生成展示子集并核对字形。不要删除许可证、手工只留下常用字或把全部分片预加载到首页。
