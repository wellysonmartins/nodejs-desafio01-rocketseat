import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table, data) {
    const newDate = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      completed_at: null,
    };

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(newDate);
    } else {
      this.#database[table] = [newDate];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data, updated_at: new Date() };
      this.#persist;
    }
  }

  updatePath(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const data = this.#database[table][rowIndex];

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        ...data,
        completed_at: new Date(),
      };
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist;
    }
  }
}
