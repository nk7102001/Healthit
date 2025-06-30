const exercises = [
  {
    name: "Push-Ups",
    part: "Upper Body",
    video: "/videos/pushups.mp4",
    description: "Works chest, shoulders, triceps."
  },
  {
    name: "Squats",
    part: "Lower Body",
    video: "/videos/squats.mp4",
    description: "Strengthens legs and glutes."
  },
  {
    name: "Plank",
    part: "Core",
    video: "/videos/planks.mp4",
    description: "Builds core strength and stability."
  },
  {
    name: "Jumping Jacks",
    part: "Cardio",
    video: "/videos/jumping-jack.mp4",
    description: "Full body warm-up."
  },
  {
    name: "Lunges",
    part: "Lower Body",
    video: "/videos/lunges.mp4",
    description: "Targets thighs and improves balance."
  },
  {
    name: "Mountain Climbers",
    part: "Cardio",
    video: "/videos/mountain-climber.mp4",
    description: "Burns calories and trains core."
  }
];

const listContainer = document.getElementById('exerciseList');
const filterDropdown = document.getElementById('partFilter');

function renderExercises(filter = "All") {
  listContainer.innerHTML = '';
  const filtered = filter === "All" ? exercises : exercises.filter(e => e.part === filter);

  filtered.forEach(ex => {
    const card = document.createElement('div');
    card.className = "border p-4 rounded shadow hover:shadow-lg transition exercise-card";
    card.innerHTML = `
      <video autoplay muted loop playsinline class="w-full h-40 object-cover rounded mb-3">
        <source src="${ex.video}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <h3 class="text-lg font-semibold text-green-700">${ex.name}</h3>
      <p class="text-sm text-gray-600">${ex.description}</p>
    `;
    listContainer.appendChild(card);
  });
}

filterDropdown.addEventListener('change', (e) => {
  renderExercises(e.target.value);
});

// Initial render
renderExercises();
