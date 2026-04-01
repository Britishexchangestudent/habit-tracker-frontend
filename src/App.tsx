import { useEffect, useState } from "react";
import type { Habit } from "./types/habit";
import { fetchHabits, createHabit, deleteHabit } from "./services/api";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    const data = await fetchHabits();
    setHabits(data);
  }

  async function handleCreateHabit() {
    if (!newHabitName.trim()) return;

    const createdHabit = await createHabit(newHabitName);
    setHabits((prev) => [...prev, createdHabit]);
    setNewHabitName("");
  }

  async function handleDeleteHabit(id: number) {
    await deleteHabit(id);
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Habit Tracker</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Enter a habit"
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleCreateHabit}>Add Habit</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.map((habit) => (
          <li
            key={habit.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <span>{habit.name}</span>
            <button onClick={() => handleDeleteHabit(habit.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;