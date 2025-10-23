import { ArtTool } from "./types";

export const API_URL = "https://66557e453c1d3b602939b8f1.mockapi.io/ArtTool";

export async function getArtTools(): Promise<ArtTool[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch art tools");
  return await res.json();
}

export async function getArtToolById(id: string | number): Promise<ArtTool> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch art tool with id ${id}`);
  return await res.json();
}
