const exercises = [
  { name: "Push-Ups", part: "Upper Body", video: "/videos/pushups.mp4", description: "Works chest, shoulders, and triceps. Great for upper body strength.", sets: "3 sets × 15 reps", level: "Beginner" },
  { name: "Squats", part: "Lower Body", video: "/videos/squats.mp4", description: "Strengthens legs, glutes, and core. The king of lower body exercises.", sets: "3 sets × 20 reps", level: "Beginner" },
  { name: "Plank", part: "Core", video: "/videos/planks.mp4", description: "Builds core strength and stability. Improves posture and endurance.", sets: "3 sets × 45 sec", level: "Beginner" },
  { name: "Jumping Jacks", part: "Cardio", video: "/videos/jumping-jack.mp4", description: "Full body warm-up that gets your heart pumping and blood flowing.", sets: "3 sets × 30 reps", level: "Beginner" },
  { name: "Lunges", part: "Lower Body", video: "/videos/lunges.mp4", description: "Targets thighs, hamstrings, and improves balance and coordination.", sets: "3 sets × 12 each", level: "Intermediate" },
  { name: "Mountain Climbers", part: "Cardio", video: "/videos/mountain-climber.mp4", description: "Burns calories, trains core and shoulders. A full body burner.", sets: "3 sets × 40 reps", level: "Intermediate" }
];

const listContainer = document.getElementById('exerciseList');

function getLevelStyle(level) {
  if (level === 'Beginner') return 'background:#dcfce7;color:#15803d;border:1px solid #bbf7d0;';
  return 'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;';
}

function renderExercises(filter = "All") {
  listContainer.innerHTML = '';
  const filtered = filter === "All" ? exercises : exercises.filter(e => e.part === filter);

  filtered.forEach((ex, i) => {
    const card = document.createElement('div');
    card.className = 'exercise-card reveal';
    card.setAttribute('data-part', ex.part);
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div style="position:relative;overflow:hidden;">
        <video autoplay muted loop playsinline style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">
          <source src="${ex.video}" type="video/mp4">
        </video>
        <div style="position:absolute;top:.75rem;left:.75rem;">
          <span class="exercise-badge">${ex.part}</span>
        </div>
        <div style="position:absolute;top:.75rem;right:.75rem;">
          <span style="display:inline-block;padding:.2rem .6rem;border-radius:99px;font-size:.72rem;font-weight:600;${getLevelStyle(ex.level)}">${ex.level}</span>
        </div>
      </div>
      <div style="padding:1.25rem;">
        <h3 style="font-family:'Sora',sans-serif;font-weight:700;font-size:1.05rem;color:var(--dark);margin-bottom:.4rem;">${ex.name}</h3>
        <p style="font-size:.85rem;color:var(--gray-600);line-height:1.55;margin-bottom:.85rem;">${ex.description}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:.8rem;font-weight:600;color:var(--green-600);background:var(--green-50);padding:.25rem .7rem;border-radius:99px;border:1px solid var(--green-200);">📋 ${ex.sets}</span>
        </div>
      </div>
    `;
    listContainer.appendChild(card);
  });

  // Trigger reveal for newly added cards
  setTimeout(() => {
    listContainer.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 50);
}

renderExercises();
