const body = document.body;
const navbar = document.getElementById("navbar");
const themePicker = document.getElementById("themePicker");
const themeTrigger = document.getElementById("themeTrigger");
const themeMenu = document.getElementById("themeMenu");
const themeDot = document.getElementById("themeDot");
const themeCurrentIcon = document.getElementById("themeCurrentIcon");
const themeCurrentName = document.getElementById("themeCurrentName");
const themeStatus = document.getElementById("themeStatus");
const themeOptions = Array.from(themeMenu.querySelectorAll(".theme-option"));
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function getSavedTheme() {
  try {
    return window.localStorage.getItem("huevos-ferreras-theme");
  } catch (error) {
    console.warn("No se pudo leer el tema guardado en el navegador.", error);
    themeStatus.textContent = "No se pudo recuperar el tema guardado. Se usará Fresh Green.";
    return null;
  }
}

function setTheme(theme, persist = false) {
  const selectedOption = themeOptions.find((option) => option.dataset.theme === theme);
  if (!selectedOption) {
    return;
  }

  if (theme === "fresh-green") {
    delete body.dataset.theme;
  } else {
    body.dataset.theme = theme;
  }
  themeCurrentIcon.textContent = selectedOption.dataset.icon;
  themeCurrentName.textContent = selectedOption.dataset.label;
  themeTrigger.setAttribute("aria-label", `Cambiar tema de color; tema actual: ${selectedOption.dataset.label}`);

  themeOptions.forEach((option) => {
    option.setAttribute("aria-checked", String(option === selectedOption));
  });

  if (persist) {
    try {
      window.localStorage.setItem("huevos-ferreras-theme", theme);
      themeStatus.textContent = `Tema ${selectedOption.dataset.label} guardado.`;
    } catch (error) {
      console.warn("No se pudo guardar el tema en el navegador.", error);
      themeStatus.textContent = `Tema ${selectedOption.dataset.label} aplicado, pero no se pudo guardar.`;
    }
  }
}

function setThemeMenuOpen(isOpen, focusSelected = false) {
  themeMenu.hidden = !isOpen;
  themeTrigger.setAttribute("aria-expanded", String(isOpen));

  if (isOpen && focusSelected) {
    themeOptions.find((option) => option.getAttribute("aria-checked") === "true").focus();
  }
}

const savedTheme = getSavedTheme();
setTheme(savedTheme || "fresh-green");

themeTrigger.addEventListener("click", () => {
  setThemeMenuOpen(themeMenu.hidden, themeMenu.hidden);
});

themeOptions.forEach((option, index) => {
  option.addEventListener("click", () => {
    setTheme(option.dataset.theme, true);
    setThemeMenuOpen(false);
    themeTrigger.focus();
  });

  option.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % themeOptions.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + themeOptions.length) % themeOptions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = themeOptions.length - 1;
    } else if (event.key === "Escape") {
      setThemeMenuOpen(false);
      themeTrigger.focus();
      return;
    } else {
      return;
    }

    event.preventDefault();
    themeOptions[nextIndex].focus();
  });
});

document.addEventListener("pointerdown", (event) => {
  if (!themePicker.contains(event.target)) {
    setThemeMenuOpen(false);
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  });
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});
