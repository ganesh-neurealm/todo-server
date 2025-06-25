import express from "express";

const router = express.Router();

let todos = []; 

const generatePatientData = () => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 1000;
    let y = (Math.random() * 80) - 40;
    if (Math.random() < 0.05) {
      y = (Math.random() < 0.5 ? 1 : -1) * (40 + Math.random() * 20);
    } else if (Math.random() < 0.1) {
      y = (Math.random() < 0.5 ? 1 : -1) * (35 + Math.random() * 10);
    }
    const dosage = 5 + Math.floor(Math.random() * 495);
    const valueCheck = Math.floor(Math.random() * 100);
    data.push({
      id: Date.now() + i,
      x,
      y,
      dosage,
      valueCheck,
      name: `Patient ${i}`,
      frequency: ["Once a day", "Twice a day", "Three times a day", "As needed"][Math.floor(Math.random() * 4)],
      isSquare: Math.random() < 0.1,
      comment: "",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });
  }
  return data;
};

let patients = generatePatientData();

router.get("/todos", (req, res) => {
  res.json(todos);
});

router.post("/todos", (req, res) => {
  const timestamp = new Date().toISOString();
  const newTodo = {
    id: Date.now(),
    ...req.body,
    createdDate: timestamp,
    updatedDate: timestamp,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const timestamp = new Date().toISOString();

  let updated = false;
  todos = todos.map((todo) => {
    if (todo.id === id) {
      updated = true;
      return {
        ...todo,
        ...req.body,
        updatedDate: timestamp,
      };
    }
    return todo;
  });

  if (updated) {
    res.json({ message: "Updated" });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

router.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== id);
  res.json({ message: "Deleted", todos });
});
// ===================
router.get("/patients", (req, res) => {
  res.json(patients);
});

router.put("/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const timestamp = new Date().toISOString();

  let updated = false;
  patients = patients.map((patient) => {
    if (patient.id === id) {
      updated = true;
      return {
        ...patient,
        ...req.body,
        updatedDate: timestamp,
      };
    }
    return patient;
  });

  if (updated) {
    res.json({ message: "Patient updated" });
  } else {
    res.status(404).json({ message: "Patient not found" });
  }
});

export default router;
