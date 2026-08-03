(() => {
  const config = window.SITE_CONFIG || {};
  const mapLink = document.querySelector("#map-link");
  if (mapLink) mapLink.href = config.mapsUrl || "https://maps.google.com";

  const form = document.querySelector("#rsvp-form");
  if (!form) return;

  const phone = form.querySelector("#phone");
  const guests = form.querySelector("#guests");
  const status = form.querySelector("#form-status");
  const button = form.querySelector("button[type='submit']");
  const successModal = document.querySelector("#success-modal");
  const closeSuccessModal = document.querySelector("#close-success-modal");

  closeSuccessModal?.addEventListener("click", () => {
    successModal.close();
    window.location.href = "index.html";
  });
  successModal?.addEventListener("click", (event) => {
    if (event.target === successModal) successModal.close();
  });

  phone.addEventListener("input", () => {
    const digits = phone.value.replace(/\D/g, "").slice(0, 11);
    phone.value = digits.length > 10
      ? digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
      : digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  });

  form.addEventListener("change", (event) => {
    if (event.target.name !== "presenca") return;
    const attending = event.target.value === "sim";
    guests.disabled = !attending;
    guests.value = attending ? Math.max(1, Number(guests.value)) : 0;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";

    if (!config.webhookUrl) {
      status.textContent = "O formulário ainda não foi conectado. Configure o webhook em assets/config.js.";
      status.classList.add("form-status--error");
      return;
    }

    button.disabled = true;
    button.querySelector("span").textContent = "Enviando...";
    const data = Object.fromEntries(new FormData(form).entries());
    data.evento = "Aniversário Ana Liz - 1 ano";
    data.enviado_em = new Date().toISOString();

    try {
      const response = await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      guests.disabled = false;
      guests.value = 1;
      status.textContent = "";
      successModal?.showModal();
    } catch (error) {
      console.error(error);
      status.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
      status.classList.add("form-status--error");
    } finally {
      button.disabled = false;
      button.querySelector("span").textContent = "Confirmar presença";
    }
  });
})();
