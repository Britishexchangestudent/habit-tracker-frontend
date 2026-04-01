import { useEffect, useState } from "react";
import { Habit } from "./types/habit";
import {
  fetchHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "./services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [editingHabitName, setEditingHabitName] = useState("");

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      const data = await fetchHabits();
      setHabits(data);
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
  }

  async function handleCreateHabit() {
    if (!newHabitName.trim()) return;

    try {
      const createdHabit = await createHabit(newHabitName.trim());
      setHabits((prev) => [...prev, createdHabit]);
      setNewHabitName("");
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  }

  function handleStartEdit(habit: Habit) {
    setEditingHabitId(habit.id);
    setEditingHabitName(habit.name);
  }

  function handleCancelEdit() {
    setEditingHabitId(null);
    setEditingHabitName("");
  }

  async function handleSaveEdit(id: number) {
    if (!editingHabitName.trim()) return;

    try {
      const updatedHabit = await updateHabit(id, editingHabitName.trim());

      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit))
      );

      setEditingHabitId(null);
      setEditingHabitName("");
    } catch (error) {
      console.error("Failed to update habit:", error);
    }
  }

  async function handleDeleteHabit(id: number) {
    try {
      await deleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit.id !== id));

      if (editingHabitId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-sm text-slate-600">
            Track simple daily habits with a clean full-stack app.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add a new habit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g. Stretching, 10k steps, Read 10 pages"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void handleCreateHabit();
                  }
                }}
              />
              <Button onClick={handleCreateHabit}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {habits.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-sm text-slate-500">
                No habits yet. Add your first one above.
              </CardContent>
            </Card>
          ) : (
            habits.map((habit) => {
              const isEditing = editingHabitId === habit.id;

              return (
                <Card key={habit.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        {isEditing ? (
                          <Input
                            value={editingHabitName}
                            onChange={(e) => setEditingHabitName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                void handleSaveEdit(habit.id);
                              }
                            }}
                          />
                        ) : (
                          <div>
                            <p className="font-medium">{habit.name}</p>
                            <p className="text-xs text-slate-500">
                              Created: {new Date(habit.created_at).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button onClick={() => handleSaveEdit(habit.id)}>
                              Save
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => handleStartEdit(habit)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteHabit(habit.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;