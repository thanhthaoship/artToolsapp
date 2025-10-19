export const API_URL = "https://66557e453c1d3b602939b8f1.mockapi.io/ArtTool";

export async function getArtTools() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function getArtToolById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}
