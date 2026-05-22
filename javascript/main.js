/* =====================================================================
   1. CONFIGURAÇÕES DOS GRÁFICOS (APEXCHARTS) E EXPORTAÇÃO
===================================================================== */
window.Apex = {
  chart: { foreColor: "#ccc", toolbar: { show: false } },
  stroke: { width: 3 },
  dataLabels: { enabled: false },
  tooltip: { theme: "dark" },
  grid: { borderColor: "#535A6C", xaxis: { lines: { show: true } } },
};

const sparklineConfig = {
  type: "line", height: 80,
  sparkline: { enabled: true },
  dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.2 },
};

const commonSparkOptions = {
  stroke: { curve: "smooth" }, markers: { size: 0 },
  grid: { padding: { top: 20, bottom: 10, left: 110 } },
  colors: ["#fff"], xaxis: { crosshairs: { width: 1 } },
  tooltip: { x: { show: false }, y: { title: { formatter: () => "" } } }
};

const spark1 = { chart: { id: "spark1", group: "sparks", ...sparklineConfig }, series: [{ data: [6, 9, 12, 23, 42, 26, 12, 24] }], ...commonSparkOptions };
const spark2 = { chart: { id: "spark2", group: "sparks", ...sparklineConfig }, series: [{ data: [33, 53, 60, 55, 51, 61, 51, 42, 44] }], ...commonSparkOptions };
const spark3 = { chart: { id: "spark3", group: "sparks", ...sparklineConfig }, series: [{ data: [28, 37, 36] }], ...commonSparkOptions };
const spark4 = { chart: { id: "spark4", group: "sparks", ...sparklineConfig }, series: [{ data: [7, 2, 6, 5, 1, 1, 7, 5, 10, 5, 3, 13, 11, 6, 14, 3, 7, 7, 10, 5] }], ...commonSparkOptions };
const spark5 = { chart: { id: "spark5", group: "sparks", ...sparklineConfig }, series: [{ data: [14, 54, 45, 15] }], ...commonSparkOptions };

const optionsLine = {
  chart: { height: 328, type: "line", zoom: { enabled: false }, dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 1 } },
  stroke: { curve: "smooth", width: 2 },
  colors: ["#00ff40", "#ff0040"],
  series: [
    { name: "Gols", data: [5, 1, 13, 15, 25, 34, 35, 30, 48, 60, 63, 69, 61, 57, 55, 53, 49, 39, 44, 45, 16, 54, 50, 45, 15] },
    { name: "Assistências", data: [4, 2, 14, 11, 10, 11, 12, 5, 18, 18, 13, 15, 20, 17, 16, 12, 13, 4, 7, 6, 4, 15, 13, 10, 4] },
  ],
  title: { text: "Contribuições de Gol (Ano Calendário)", align: "left", offsetY: 25, offsetX: 20 },
  subtitle: { text: "Estatísticas Oficiais", offsetY: 55, offsetX: 20 },
  markers: { size: 6, strokeWidth: 0, hover: { size: 9 } },
  grid: { show: true, padding: { bottom: 0 } },
  labels: ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  xaxis: { tooltip: { enabled: false } },
  legend: { position: "top", horizontalAlign: "right", offsetY: -20 },
};

/* =====================================================================
   2. SISTEMA E LÓGICA DO QUIZ
===================================================================== */
const questions = [
  { q: "Qual esporte o Cristiano Ronaldo joga?", a: ["Basquete", "Futebol", "Tênis", "Golfe"], c: 1 },
  { q: "Qual número ele usa na camisa?", a: ["10", "9", "7", "11"], c: 2 },
  { q: "Qual o grito icônico que ele dá nos gols?", a: ["Receba!", "Goloo!", "Siuuu!", "Ihuu!"], c: 2 },
  { q: "Em qual país ele nasceu?", a: ["Brasil", "Portugal", "Espanha", "Itália"], c: 1 },
  { q: "Como os fãs brasileiros chamam ele?", a: ["Robozão", "Mágico", "Menino Ney", "Fera"], c: 0 },
  { q: "CR7 é conhecido por ser um jogador que:", a: ["Não treina", "É super focado e treina muito", "Não gosta de bola", "Dorme no jogo"], c: 1 },
  { q: "Em qual time ele ganhou muitas Champions?", a: ["Barcelona", "Real Madrid", "Vasco", "PSG"], c: 1 },
  { q: "A cor da seleção dele (Portugal) é:", a: ["Azul", "Branco", "Vermelho e Verde", "Roxo"], c: 2 },
  { q: "O que ele mais ama fazer em campo?", a: ["Gols", "Faltas", "Sair cedo", "Conversar"], c: 0 },
  { q: "Ele é considerado o melhor por muitos?", a: ["Não", "Talvez", "Sim, o GOAT!", "Quem?"], c: 2 }
];

let currentIdx = 0, points = 0, timerInterval, timeLeft = 10, canClick = true;
const imgHappy = "https://www.rbsdirect.com.br/imagesrc/25444390.jpg?w=700";
const imgSad = "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2022/12/10/1183188204-cristiano-ronaldo-portugal-choro-copa-do-mundo.jpg";
const imgDefault = "https://m.media-amazon.com/images/I/61NlM3v9VGL._AC_UF1000,1000_QL80_.jpg";

function startQuiz() {
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('question-screen').style.display = 'block';
  loadQ();
}

function loadQ() {
  canClick = true; timeLeft = 10;
  const q = questions[currentIdx];
  document.getElementById('question-text').innerText = q.q;
  document.getElementById('question-number').innerText = `${currentIdx + 1}/10`;
  document.getElementById('cr7-avatar').src = imgDefault;

  const container = document.getElementById('options-container');
  container.innerHTML = '';
  q.a.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn animate__animated animate__fadeInUp';
    btn.style.animationDelay = `${i * 0.1}s`;
    btn.innerHTML = `<span>${i + 1}.</span> ${opt}`;
    btn.onclick = () => checkAns(i);
    container.appendChild(btn);
  });
  runTimer();
}

function runTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    document.getElementById('timer-bar').style.width = (timeLeft * 10) + "%";
    document.getElementById('quiz-timer').innerText = Math.ceil(timeLeft) + "s";
    if (timeLeft <= 0) { clearInterval(timerInterval); checkAns(-1); }
  }, 100);
}

function checkAns(idx) {
  if (!canClick) return;
  canClick = false; clearInterval(timerInterval);

  const correct = questions[currentIdx].c;
  const btns = document.querySelectorAll('.option-btn');
  const avatar = document.getElementById('cr7-avatar');
  const card = document.getElementById('quiz-container');

  if (idx === correct) {
    points++;
    btns[idx].classList.add('correct');
    avatar.src = imgHappy;
    showSiuuu("SIUUU!", true);
  } else {
    card.classList.add('animate__shakeX');
    if (idx !== -1) btns[idx].classList.add('wrong');
    btns[correct].classList.add('correct');
    avatar.src = imgSad;
    showSiuuu("OPS!", false);
    setTimeout(() => card.classList.remove('animate__shakeX'), 500);
  }

  setTimeout(() => {
    currentIdx++;
    if (currentIdx < questions.length) loadQ(); else showFinal();
  }, 1500);
}

function showSiuuu(txt, isGood) {
  const el = document.getElementById('reaction-overlay');
  if (!el) return;
  el.innerText = txt;
  el.style.color = isGood ? "#ffcc00" : "#ff4444";
  el.classList.add('reaction-active');
  setTimeout(() => el.classList.remove('reaction-active'), 800);
}

function showFinal() {
  document.getElementById('question-screen').style.display = 'none';
  if (points === 10) { triggerGoatVictory(); }
  else {
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('score-circle').innerText = points;
    document.getElementById('result-message').innerText = points >= 7 ? "Quase um Robozão! Tente o 10/10." : "Treine mais seus reflexos!";
  }
}

function restartQuiz() {
  currentIdx = 0; points = 0;
  document.getElementById('result-screen').style.display = 'none';
  const goatModal = document.getElementById('goat-modal');
  if (goatModal) goatModal.style.display = 'none';
  document.getElementById('setup-screen').style.display = 'block';
}

function triggerGoatVictory() {
  const modal = document.getElementById('goat-modal');
  if (modal) modal.style.display = 'flex';

  if (typeof confetti !== 'undefined') {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
}

// Unificação da função de compartilhar
function shareResult() {
  const text = `EU SOU O GOAT! 🐐 Acertei ${points}/10 no Quiz do Cristiano Ronaldo. Consegue bater meu recorde?`;
  if (navigator.share) {
    navigator.share({ title: 'Quiz CR7', text: text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text).then(() => alert("Vitória copiada para a área de transferência! SIUUU!"));
  }
}

// Atalhos de Teclado do Quiz
document.addEventListener('keydown', (e) => {
  const quizScreen = document.getElementById('question-screen');
  if (quizScreen && quizScreen.style.display === 'block') {
    if (['1', '2', '3', '4'].includes(e.key)) checkAns(parseInt(e.key) - 1);
  }
});

/* =====================================================================
   3. INICIALIZAÇÃO ÚNICA DA PÁGINA (CONSOLIDAÇÃO GERAL)
===================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  // --- 3.1. RENDERIZAÇÃO DOS GRÁFICOS ---
  if (document.querySelector("#spark1") && typeof ApexCharts !== 'undefined') {
    new ApexCharts(document.querySelector("#spark1"), spark1).render();
    new ApexCharts(document.querySelector("#spark2"), spark2).render();
    new ApexCharts(document.querySelector("#spark3"), spark3).render();
    new ApexCharts(document.querySelector("#spark4"), spark4).render();
    new ApexCharts(document.querySelector("#spark5"), spark5).render();
    new ApexCharts(document.querySelector("#line-adwords"), optionsLine).render();
  }

  // --- 3.2. EXPORTAÇÃO FUSION CHARTS ---
  const exportBtn = document.getElementById("fusionexport-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", async function () {
      const endPoint = "https://www.fusioncharts.com/demos/dashboards/fusionexport-apexcharts/api/export-dashboard";
      this.setAttribute("disabled", true);
      try {
        const { data } = await axios.post(endPoint, { dashboardName: "dark" }, { responseType: "blob" });
        await download(data, "apexCharts-dark-dashboard.pdf", "application/pdf");
      } catch (error) { console.error("Erro na exportação:", error); }
      this.removeAttribute("disabled");
    });
  }

  // --- 3.3. EFEITO RIPPLE (BOTÃO START QUIZ) ---
  const style = document.createElement('style');
  style.innerHTML = `.ripple-effect { position: absolute; background: rgba(255, 255, 255, 0.5); transform: translate(-50%, -50%); pointer-events: none; border-radius: 50%; animation: ripple-animation 0.6s linear; } @keyframes ripple-animation { from { width: 0; height: 0; opacity: 0.5; } to { width: 500px; height: 500px; opacity: 0; } }`;
  document.head.appendChild(style);

  const startBtn = document.querySelector('.btn-action.start');
  if (startBtn) {
    startBtn.addEventListener('click', function (e) {
      let ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      this.appendChild(ripple);
      let x = e.clientX - e.target.offsetLeft;
      let y = e.clientY - e.target.offsetTop;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // --- 3.4. MENU NAVBAR E SCROLL GERAL ---
  const navbar = document.querySelector("nav");
  const menuBtn = document.querySelector(".btn"); // Apenas a versão correta
  const navList = document.querySelector("nav ul");
  const navLinks = document.querySelectorAll(".items a");
  const scrollBtn = document.querySelector(".scrollToTop-btn");

  window.addEventListener("scroll", () => {
    // Menu Sticky
    if (window.scrollY > 50) navbar.classList.add("sticky");
    else navbar.classList.remove("sticky");
    // Botão Voltar ao Topo
    if (scrollBtn) scrollBtn.classList.toggle("active", window.scrollY > 500);
  });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
    });
  }

  // Toggle do Menu Mobile
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".items").forEach(item => item.classList.toggle("show"));
      menuBtn.classList.toggle("hide");
    });
  }

  // Fechar o menu Mobile ao clicar no link e fazer rolagem suave
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      // Fecha menu mobile
      document.querySelectorAll(".items").forEach(item => item.classList.remove("show"));
      if (menuBtn) menuBtn.classList.remove("hide");

      // Scroll suave
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // Título da Aba Dinâmico
  const originalTitle = document.title;
  window.addEventListener("blur", () => { document.title = "O GOAT te espera! ⚽"; });
  window.addEventListener("focus", () => { document.title = originalTitle; });

  // --- 3.5. OBSERVERS UNIFICADOS (ANIMAÇÕES AO ROLAR) ---
  const scrollObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Revelação de Caixas de Conteúdo
        if (el.classList.contains("content") || el.tagName === "SECTION" || el.classList.contains("stats-details")) {
          el.classList.add("reveal", "active");
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
        // Animação de espaçamento em parágrafos
        if (el.tagName === "P") {
          el.style.letterSpacing = "0px";
          el.style.opacity = "1";
        }
        // Animação Sequencial dos Clubes
        if (el.classList.contains("clubs")) {
          const clubItems = el.querySelectorAll("li");
          clubItems.forEach((li, i) => {
            setTimeout(() => {
              li.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
              li.style.opacity = "1";
              li.style.transform = "translateY(0)";
            }, i * 150);
          });
          obs.unobserve(el);
        }
        // Animação do Título do Quiz
        if (el.classList.contains("title")) {
          el.style.opacity = "1";
          el.classList.add('animate__animated', 'animate__fadeInDown');
          const span = el.querySelector('span');
          if (span) span.style.setProperty('--line-width', '100%');
          obs.unobserve(el);
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".content, section, .stats-details, .stats-details-two, .content p, .clubs, .quiz-section .title").forEach(el => {
    scrollObserver.observe(el);
  });

  // Observer específico para contagem de números
  const statsNumbers = document.querySelectorAll(".details h3");
  const numberObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const val = parseInt(entry.target.innerText);
        if (!isNaN(val)) {
          let start = 0;
          const increment = val / (2000 / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= val) { entry.target.innerText = val; clearInterval(timer); }
            else { entry.target.innerText = Math.floor(start); }
          }, 16);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsNumbers.forEach(n => numberObserver.observe(n));

  // --- 3.6. EFEITOS 3D E PARALLAX UNIFICADOS ---
  // Função universal de inclinação 3D
  const apply3DTilt = (element, strength = 15) => {
    if (!element) return;
    element.addEventListener("mousemove", (e) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      element.style.transform = `perspective(1000px) rotateY(${x * strength}deg) rotateX(${y * -strength}deg) scale(1.02)`;
    });
    element.addEventListener("mouseleave", () => {
      element.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`;
    });
  };

  // Aplicando em todos os cards de estatísticas e capas de jogos
  document.querySelectorAll(".games .left img, .play .left img, .stats-details, .stats-details-two").forEach(el => apply3DTilt(el, 10));

  // Parallax Textos (Home e Hover do Título)
  const titleH1 = document.querySelector(".content h1");
  const contentBox = document.querySelector(".content");

  if (titleH1 && contentBox) {
    document.addEventListener("mousemove", (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 45;
      const y = (window.innerHeight / 2 - e.pageY) / 45;
      contentBox.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    titleH1.innerHTML = titleH1.textContent.split("").map(char => `<span class="letter" style="display:inline-block; transition: 0.3s">${char === " " ? "&nbsp;" : char}</span>`).join("");
    document.querySelectorAll(".letter").forEach(char => {
      char.addEventListener("mouseover", () => { char.style.color = "#e74c3c"; char.style.transform = "translateY(-10px) scale(1.2)"; });
      char.addEventListener("mouseout", () => { char.style.color = ""; char.style.transform = "translateY(0) scale(1)"; });
    });
  }

  // Animação exclusiva de flutuação e giro da Imagem Principal do CR7
  const cr7Container = document.querySelector(".imgbx");
  const cr7Img = document.querySelector(".imgbx img");
  if (cr7Img && cr7Container) {
    cr7Img.classList.add("float-animation");
    cr7Container.addEventListener("mousemove", (e) => {
      cr7Img.style.animation = "none";
      const rect = cr7Container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / -15;
      const y = (e.clientY - rect.top - rect.height / 2) / 15;
      cr7Img.style.transform = `rotateX(${y}deg) rotateY(${x}deg) scale(1.05)`;
    });
    cr7Container.addEventListener("mouseleave", () => {
      cr7Img.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      setTimeout(() => { if (cr7Img.style.transform === "rotateX(0deg) rotateY(0deg) scale(1)") cr7Img.style.animation = "hoverFloat 4s ease-in-out infinite"; }, 100);
    });
  }

});
// ==========================================================
// EFEITOS AVANÇADOS (PARA IMPRESSIONAR NA APRESENTAÇÃO)
// ==========================================================

// 1. BARRA DE PROGRESSO DE SCROLL
window.addEventListener("scroll", () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) progressBar.style.width = scrolled + "%";
});

// 2. EFEITO MÁQUINA DE ESCREVER (TYPEWRITER)
const phrases = ["O Melhor do Mundo.", "O Robozão.", "O GOAT.", "A Lenda de Portugal."];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeTarget = document.getElementById("typewriter");

function typeEffect() {
  if (!typeTarget) return;
  const currentPhrase = phrases[phraseIdx];

  // Adiciona ou remove letras
  if (isDeleting) charIdx--; else charIdx++;

  // Atualiza o texto na tela
  typeTarget.innerText = currentPhrase.substring(0, charIdx);

  // Lógica de velocidade
  let speed = isDeleting ? 50 : 100; // Apaga rápido, digita devagar

  if (!isDeleting && charIdx === currentPhrase.length) {
    speed = 2000; // Pausa no final da frase
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length; // Pula para a próxima frase
    speed = 500; // Pausa antes de começar a nova
  }
  setTimeout(typeEffect, speed);
}
if (typeTarget) typeEffect();

// 3. PARTÍCULAS FLUTUANTES (API CANVAS)
const canvas = document.getElementById("hero-particles");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particlesArray = [];

  // Ajusta o tamanho do canvas para o tamanho da seção Home
  canvas.width = document.querySelector(".home").offsetWidth;
  canvas.height = document.querySelector(".home").offsetHeight;

  window.addEventListener("resize", () => {
    canvas.width = document.querySelector(".home").offsetWidth;
    canvas.height = document.querySelector(".home").offsetHeight;
  });

  // Classe da Partícula
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1; // Tamanho entre 1 e 4
      this.speedX = (Math.random() * 1) - 0.5; // Vai para direita ou esquerda
      this.speedY = (Math.random() * 1) - 0.5; // Vai para cima ou baixo
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      // Se a bolinha sair da tela, ela volta do outro lado
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    draw() {
      ctx.fillStyle = "rgba(255, 204, 0, 0.4)"; // Dourado meio transparente
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Cria 50 partículas iniciais
  for (let i = 0; i < 50; i++) particlesArray.push(new Particle());

  // Loop de Animação Infinita do Canvas
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o rastro
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animateParticles); // Chama o próximo frame de forma otimizada
  }
  animateParticles();
}
