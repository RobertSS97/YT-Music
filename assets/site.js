// Aponta os botões de download para o instalador da versão mais recente (com fallback para a página de versões).
(async () => {
  const buttons = document.querySelectorAll("[data-download]");
  const meta = document.querySelector("[data-release-meta]");
  try {
    const response = await fetch("https://api.github.com/repos/RobertSS97/YT-Music/releases/latest");
    if (!response.ok) return;
    const release = await response.json();
    const msi = (release.assets || []).find((a) => a.name.endsWith(".msi"));
    if (!msi) return;
    buttons.forEach((b) => (b.href = msi.browser_download_url));
    if (meta) {
      const mb = (msi.size / 1024 / 1024).toFixed(0);
      const version = release.tag_name.replace(/^v/, "");
      meta.textContent = meta.dataset.template.replace("{version}", version).replace("{size}", mb);
    }
  } catch {
    /* sem rede ou limite da API: os links já apontam para a página de versões */
  }
})();
