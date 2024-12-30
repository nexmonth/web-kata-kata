
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ButtonSend = document.getElementById('ButtonSend')
const messageInput = document.getElementById('messageInput')

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Fireworks Class
class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.particles = [];
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: x,
        y: y,
        dx: random(-3, 3),
        dy: random(-3, 3),
        alpha: 1
      });
    }
  }

  update() {
    this.particles.forEach(particle => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.alpha -= 0.01;
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  draw() {
    this.particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${particle.alpha})`;
      ctx.fill();
    });
  }
}

// Fireworks Array
const fireworks = [];
document.getElementById('celebrateButton').addEventListener('click', () => {
  var audio = new Audio("/almostday.mp3")
  audio.play()

  const celebrateButton = document.getElementById('celebrateButton')
  const title = document.querySelector('.title')
  const subtitle = document.querySelector('.subtitle')
  celebrateButton.style.display = "none"
  title.textContent = "Tuliskan harapan mu di 2025"
  subtitle.textContent = ""

  ButtonSend.style.display = "flex"
  messageInput.style.display = "flex"
  
});

ButtonSend.addEventListener("click", () => {
  fetch(`https://endpoint-fawn.vercel.app/api/completion/llama3-8b/${messageInput.value} sesingkatnya dan jawab sesuai agama islam`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    }).then((data) => {
      if (data) {
        for (let i = 0; i < 5; i++) {
          fireworks.push(new Firework(
            random(100, canvas.width - 100),
            random(100, canvas.height - 100),
            `${Math.floor(random(100, 255))}, ${Math.floor(random(100, 255))}, ${Math.floor(random(100, 255))}`
          ));
        }
        const subtitle = document.querySelector('.subtitle')
        const celebrateButton = document.getElementById('celebrateButton')
        celebrateButton.style.display = "none"
        subtitle.textContent = data.reply
        generateConfetti();
        messageInput.style.display = "none"
        ButtonSend.style.display = "none"
      }
    })
})

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.particles.length === 0) fireworks.splice(index, 1);
  });
  requestAnimationFrame(animate);
}

// Confetti Effect
function generateConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${random(0, window.innerWidth)}px`;
    confetti.style.animationDuration = `${random(2, 5)}s`;
    confetti.style.backgroundColor = `hsl(${random(0, 360)}, 100%, 70%)`;
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

animate();