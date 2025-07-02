import express from "express";

const router = express.Router();

let todos = []; 

const generatePatientData = () => {
  const data = [];
  const startDate = new Date(2014, 0, 1); // Jan 1, 2014
  const today = new Date();
  let currentDate = new Date(startDate);
  let x = 0;

  while (data.length < 2000 && currentDate <= today) {
    const date = new Date(currentDate); 
    const isoDate = date.toISOString();

    let y = Math.random() * 80 - 40;
    if (Math.random() < 0.05) {
      y = (Math.random() < 0.5 ? 1 : -1) * (40 + Math.random() * 20);
    } else if (Math.random() < 0.1) {
      y = (Math.random() < 0.5 ? 1 : -1) * (35 + Math.random() * 10);
    }

    const dosage = 5 + Math.floor(Math.random() * 495);
    const valueCheck = Math.floor(Math.random() * 100);

    data.push({
      id: Date.now() + data.length,
      x: x++,
      y,
      date: isoDate,
      dosage,
      valueCheck,
      name: `Patient ${data.length}`,
      frequency: ["Once a day", "Twice a day", "Three times a day", "As needed"][Math.floor(Math.random() * 4)],
      isSquare: Math.random() < 0.1,
      comment: "",
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    });

    const monthIncrement = Math.random() < 0.5 ? 2 : 3; // randomly 2 or 3 months
    currentDate.setMonth(currentDate.getMonth() + monthIncrement);
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
