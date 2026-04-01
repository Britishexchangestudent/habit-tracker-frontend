import type { Habit } from "../types/habit";


const API_BASE_URL = "http://localhost:3001";

export async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(`${API_BASE_URL}/habits`);
  return response.json();
}

export async function createHabit(name: string): Promise<Habit> {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return response.json();
}

export async function deleteHabit(id: number): Promise<void> {
  await fetch(`${API_BASE_URL}/habits/${id}`, {
    method: "DELETE",
  });
}