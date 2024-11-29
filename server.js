const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

class AnimalApp {
  constructor() {
    this.app = express();
    this.PORT = 3000;
    this.bigCatsFilePath = path.join(__dirname, "data/bigCats.json");
    this.dogsFilePath = path.join(__dirname, "data/dogs.json");
    this.bigFishesFilePath = path.join(__dirname, "data/bigFishes.json");

    this.app.use(bodyParser.json());
    this.app.use(express.static("src"));

    this.bigCatsData = [];
    this.dogsData = [];
    this.bigFishesData = [];

    this.readAllData();

    this.app.get("/animals/big-cats", this.getBigCats.bind(this));
    this.app.get("/animals/big-fishes", this.getBigFishes.bind(this));
    this.app.get("/animals/dogs", this.getDogs.bind(this));

    this.app.post("/animals", this.addAnimal.bind(this));

    this.startServer();
  }

  readAllData() {
    this.bigCatsData = this.readData(this.bigCatsFilePath);
    this.dogsData = this.readData(this.dogsFilePath);
    this.bigFishesData = this.readData(this.bigFishesFilePath);
  }

  readData(filePath) {
    try {
      const rawData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(rawData);
    } catch (err) {
      console.error("Error reading data file:", err);
      return [];
    }
  }

  writeData(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing data file:", err);
    }
  }

  getBigCats(req, res) {
    res.json(this.bigCatsData);
  }

  getBigFishes(req, res) {
    res.json(this.bigFishesData);
  }

  getDogs(req, res) {
    res.json(this.dogsData);
  }

  addAnimal(req, res) {
    const newAnimal = req.body;
    if (
      !newAnimal.category ||
      !["bigCat", "bigFish", "dog"].includes(newAnimal.category)
    ) {
      return res.status(400).json({
        message:
          "Invalid or missing category! Use 'bigCat', 'bigFish', or 'dog'",
      });
    }

    let data = [];
    if (newAnimal.category === "bigCat") {
      data = this.bigCatsData;
    } else if (newAnimal.category === "bigFish") {
      data = this.bigFishesData;
    } else if (newAnimal.category === "dog") {
      data = this.dogsData;
    }

    if (
      data.find((a) => a.name.toLowerCase() === newAnimal.name.toLowerCase())
    ) {
      return res
        .status(400)
        .json({ message: "Animal already exists in the selected category!" });
    }

    data.push(newAnimal);
    if (newAnimal.category === "bigCat") {
      this.writeData(this.bigCatsFilePath, this.bigCatsData);
    } else if (newAnimal.category === "bigFish") {
      this.writeData(this.bigFishesFilePath, this.bigFishesData);
    } else if (newAnimal.category === "dog") {
      this.writeData(this.dogsFilePath, this.dogsData);
    }

    res
      .status(201)
      .json({ message: "Animal added successfully!", animal: newAnimal });
  }

  startServer() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on http://localhost:${this.PORT}`);
    });
  }
}

new AnimalApp();
