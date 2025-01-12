(function () {
  "use strict";

  // ======= Sticky
  window.onscroll = function () {
    const header = document.querySelector(".header");
    const sticky = header.offsetTop;
    const logo = document.querySelector(".navbar-brand img");

    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }

    // === logo change
    if (header.classList.contains("sticky")) {
      logo.src = "assets/images/logo/logo-2.svg";
    } else {
      logo.src = "assets/images/logo/logo.svg";
    }

    // show or hide the back-top-top button
    const backToTop = document.querySelector(".back-to-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  };

  // ==== for menu scroll
  const pageLink = document.querySelectorAll(".menu-scroll");

  pageLink.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(elem.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 60,
      });
    });
  });

  // section menu active
  function onScroll(event) {
    const sections = document.querySelectorAll(".menu-scroll");
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    for (let i = 0; i < sections.length; i++) {
      const currLink = sections[i];
      const val = currLink.getAttribute("href");
      const refElement = document.querySelector(val);
      const scrollTopMinus = scrollPos + 73;
      if (
        refElement.offsetTop <= scrollTopMinus &&
        refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
      ) {
        document.querySelector(".menu-scroll").classList.remove("active");
        currLink.classList.add("active");
      } else {
        currLink.classList.remove("active");
      }
    }
  }

  window.document.addEventListener("scroll", onScroll);

  //===== close navbar-collapse when a  clicked
  let navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  document.querySelectorAll(".menu-scroll").forEach((e) =>
    e.addEventListener("click", () => {
      navbarToggler.classList.remove("active");
      navbarCollapse.classList.remove("show");
    })
  );
  navbarToggler.addEventListener("click", function () {
    navbarToggler.classList.toggle("active");
    navbarCollapse.classList.toggle("show");
  });

  // ===== submenu
  const submenuButton = document.querySelectorAll(".nav-item-has-children");
  submenuButton.forEach((elem) => {
    elem.querySelector("a").addEventListener("click", () => {
      elem.querySelector(".submenu").classList.toggle("show");
    });
  });

  // ===== wow js
  new WOW().init();

  // ====== scroll top js
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;

      const val = Math.easeInOutQuad(currentTime, start, change, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  document.querySelector(".back-to-top").onclick = () => {
    scrollTo(document.documentElement);
  };
})();
// calculate 

let dollarRates = {
  venezuela: 0,
  brasil: 0,
  chile: 0,
};

async function getDollarValueVenezuela() {
  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares");
    const data = await response.json();
    const dolarCentral = data[0].promedio;
    const dolarParalelo = data[2].promedio;
    const sumDollar = (dolarCentral + dolarParalelo) / 2
    dollarRates.venezuela = sumDollar + 2.2;
  } catch (error) {
    console.error("Error al obtener los datos de Venezuela:", error);
  }
}

async function getDollarValueBrazil() {
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
    const data = await response.json();
    // Guardar la tasa en BRL directamente
    dollarRates.brasil = parseFloat(data.USDBRL.ask); // Por ejemplo, 6.0914
    console.log(`Tasa USD a BRL: ${dollarRates.brasil}`);
  } catch (error) {
    console.error("Error al obtener los datos de Brasil:", error);
  }
}


async function getDollarValueChile() {
  try {
    const response = await fetch("https://mindicador.cl/api");
    const data = await response.json();
    dollarRates.chile = data.dolar.valor;
  } catch (error) {
    console.error("Error al obtener los datos de Chile:", error);
  }
}

async function initializeRates() {
  await getDollarValueVenezuela();
  await getDollarValueBrazil();
  await getDollarValueChile();
}

function calculateBolivares() {

  const country = document.getElementById("country").value; // Brasil o Chile
  const amount = parseFloat(document.getElementById("amount").value); // Monto en USD
  const bolivarRate = dollarRates.venezuela; // Tasa de USD a VES

  if (isNaN(amount) || amount <= 0) {
    alert("Por favor, ingresa un monto válido.");
    return;
  }

  if (bolivarRate > 0 && dollarRates[country] > 0) {
    // Calcular monto en bolívares
    const bolivares = amount * (bolivarRate / dollarRates[country]);
    const formattedBolivares = bolivares.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    document.getElementById("result").textContent = `Resultado en Bs: ${formattedBolivares}`;
  } else {
    alert("Asegúrate de que los valores de las tasas estén disponibles.");
  }
}



document.addEventListener("DOMContentLoaded", initializeRates);