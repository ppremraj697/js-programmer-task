class BigCats {
  constructor() {
    this.animalCardsContainer = document.getElementById("animalCards");
    this.addAnimalForm = document.getElementById("addAnimalForm");
    this.sortFieldSelect = document.getElementById("sortField");
    this.sortOrderSelect = document.getElementById("sortOrder");
    this.applySortButton = document.getElementById("applySort");
    this.animals = [];

    this.addAnimalForm.addEventListener("submit", this.addAnimal.bind(this));
    this.applySortButton.addEventListener(
      "click",
      this.applySorting.bind(this)
    );

    this.fetchAnimals();
  }

  async fetchAnimals() {
    try {
      const response = await fetch("/animals/big-cats");
      this.animals = await response.json();
      this.renderCards();
    } catch (err) {
      console.error("Error fetching animals:", err);
    }
  }

  renderCards() {
    this.animalCardsContainer.innerHTML = "";
    this.animals.forEach((animal) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.width = "18rem";
      card.style.height = "25rem";
      card.innerHTML = `
        <div class="animal-image">
          <img src="${animal.image}" class="card-img-top" alt="${
        animal.name
      }" />
        </div>
        <div class="card-body">
          <p>Name: ${animal.name}</p>
          <p>Size: ${animal.size} ft</p>
          <p>Location: ${animal.location.join(", ")}</p>
          <button class="btn btn-primary" onclick="animalManager.deleteAnimal('${
            animal.name
          }')">Delete</button>
        </div>
      `;
      this.animalCardsContainer.appendChild(card);
    });
  }

  async addAnimal(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const size = parseInt(document.getElementById("size").value.trim());
    const location = document
      .getElementById("location")
      .value.trim()
      .split(",");
    const image = document.getElementById("image").value.trim();

    try {
      await fetch("/animals/big-cats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, size, location, image }),
      });
      this.fetchAnimals();
    } catch (err) {
      console.error("Error adding animal:", err);
    }
  }

  applySorting() {
    const field = this.sortFieldSelect.value;
    const order = this.sortOrderSelect.value;

    if (field) {
      this.animals.sort((a, b) => {
        if (field === "size") {
          return order === "asc" ? a.size - b.size : b.size - a.size;
        }
        return order === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      });
      this.renderCards();
    }
  }
}

const bigCats = new BigCats();
