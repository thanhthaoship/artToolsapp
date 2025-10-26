import { ArtTool } from '../types/artTool';

const API_URL = 'https://66557e453c1d3b602939b8f1.mockapi.io/ArtTool';

// Lấy toàn bộ danh sách ArtTools
export async function fetchArtTools(): Promise<ArtTool[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch art tools');
  return res.json();
}

// Lấy chi tiết 1 art tool
export async function fetchArtToolById(id: string): Promise<ArtTool> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch art tool detail');
  return res.json();
}
