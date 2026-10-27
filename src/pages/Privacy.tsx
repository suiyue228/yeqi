export function Privacy({ backup }: { backup: () => void }) {
  return (
    <div className="page privacy-page">
      <div className="page-intro">
        <span className="eyebrow">A QUIET PROMISE · 关于这处树洞</span>
        <h1 id="page-title" tabIndex={-1}>
          你的心事，留在你这里。
        </h1>
        <p>安静，也意味着把数据的去向说清楚。</p>
      </div>
      <article className="privacy-paper">
        <section>
          <h2>01 ／ 记忆住在哪里？</h2>
          <p>
            日记、草稿、心愿与收藏索引只保存在当前浏览器的本地存储（localStorage）中。网站不会把私人文字发送到外部服务，没有账号、分析追踪或云同步；音乐与音效也在本机合成，不下载第三方音频。
          </p>
          <p>
            不同浏览器、设备、网址或端口拥有各自独立的数据。开发地址与构建预览地址中的记录也不会自动互通。
          </p>
        </section>
        <section>
          <h2>02 ／ 请给记忆留一份备份</h2>
          <p>
            清理浏览器数据、使用隐私窗口或卸载浏览器可能让记录丢失。请定期导出
            JSON
            文件，包含日记、草稿、心愿与收藏索引，并妥善保存到自己信任的位置。备份是可阅读的纯文本，也包含你的私人心事。
          </p>
          <button className="button ink-button" onClick={backup}>
            ↓ 导出全部记忆 · JSON
          </button>
          <p className="small-note">
            第一版提供导出，尚未提供文件导入。请保留备份文件，未来恢复功能可基于同一版本格式开发。
          </p>
        </section>
        <section>
          <h2>03 ／ 这扇门没有密码锁</h2>
          <p>
            本地存储未加密，能够使用你的设备及浏览器的人可能读取这些记录。此网站提供私人书写空间，不提供设备级加密或密码保护。
          </p>
        </section>
        <section>
          <h2>04 ／ 写入失败时</h2>
          <p>
            存储已满或权限被禁用时，页面会保留你的输入并明确提示未保存。请先复制文字，导出已有记录，再处理浏览器权限。检测到损坏数据时暂停写入，避免覆盖，并允许导出原始内容。
          </p>
        </section>
      </article>
    </div>
  );
}
