// Vitrine "Veja por dentro": abas trocam a captura e a legenda (setas do teclado também).
document.querySelectorAll("[data-showcase]").forEach((showcase) => {
  const tabs = [...showcase.querySelectorAll('[role="tab"]')];
  const images = [...showcase.querySelectorAll(".stage img")];
  const caption = showcase.querySelector(".caption");
  const select = (index, focus) => {
    tabs.forEach((t, i) => {
      t.setAttribute("aria-selected", String(i === index));
      t.tabIndex = i === index ? 0 : -1;
    });
    images.forEach((img, i) => img.classList.toggle("active", i === index));
    caption.innerHTML = tabs[index].dataset.caption;
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i, false));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") select((i + 1) % tabs.length, true);
      if (e.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length, true);
    });
  });
  // Pré-carrega as demais capturas depois que a página abre, para a troca ser instantânea.
  addEventListener("load", () => images.forEach((img) => (img.loading = "eager")));
});

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
