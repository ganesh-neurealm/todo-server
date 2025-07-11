import express from "express";

const router = express.Router();

let todos = []; 



const generatePatientData = () => {
  const data = [];
  const today = new Date();
  const startDate = new Date(2014, 0, 1); 
  let currentDate = new Date(startDate);
  let x = 0;

  while (currentDate <= today && data.length < 40000) {
    const patientsThisMonth = 3 + Math.floor(Math.random() * 5); 

    for (let i = 0; i < patientsThisMonth; i++) {
      if (data.length >= 40000) break;

      const dayOffset = Math.floor(Math.random() * 28);
      const patientDate = new Date(currentDate);
      patientDate.setDate(patientDate.getDate() + dayOffset);
      if (patientDate > today) break;

      const yBase = Math.random() * 80 - 40;
      let y = yBase;
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
        date: patientDate.toISOString(),
        dosage,
        valueCheck,
        name: `Patient ${data.length}`,
        frequency: ["Once a day", "Twice a day", "Three times a day", "As needed"][Math.floor(Math.random() * 4)],
        isSquare: Math.random() < 0.1,
        comment: "",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      });
    }

    currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
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

router.get("/chart", (req, res) => {
  const trace1 = {
    x: [1, 2, 3, 4, 5],
    y: [2, 5, 1, 8, 6],
    mode: "lines+markers+text",
    type: "scatter",
    name: "Patient A",
    text: ["a", "b", "c", "d", "e"],
    marker: { color: "red", size: 8 },
    line: { color: "red", width: 2 },
  };

  const trace2 = {
    x: [1, 2, 3, 4, 5],
    y: [3, 4, 2, 7, 5],
    mode: "lines+markers",
    type: "scatter",
    name: "Patient B",
    marker: { color: "black", size: 8 },
    line: { color: "black", width: 2 },
  };

  const layout = {
    title: "Server-Side Scatter Line Chart",
    xaxis: { title: "Time" },
    yaxis: { title: "Value" },

  };

  const plotlyData = JSON.stringify([trace1, trace2]);
  const plotlyLayout = JSON.stringify(layout);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MPI Charts</title>
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      <style>
        body { margin: 40px; font-family: Arial; }
      </style>
    </head>
    <body>
      <h2>Plot Generated from Node.js Backend</h2>
      <div id="chart" style="width: 100%; height: 600px;"></div>
      <script>
        const data = ${plotlyData};
        const layout = ${plotlyLayout};
        Plotly.newPlot('chart', data, layout);
      </script>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

export default router;
