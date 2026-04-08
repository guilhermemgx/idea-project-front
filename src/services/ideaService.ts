import { CreateIdeaInput, Idea, UpdateIdeaInput } from '../types/idea';

const API_URL = import.meta.env.VITE_API_URL

function normalizeIdea(data: any): Idea {
  return {
    id: Number(data.id),
    author_re: String(data.author_re ?? ''),
    what_can_be_improved: String(data.what_can_be_improved ?? ''),
    current_process: String(data.current_process ?? ''),
    proposed_improvement: String(data.proposed_improvement ?? ''),
    expected_benefit: String(data.expected_benefit ?? ''),
    registered_at: String(data.registered_at ?? ''),
    created_at: String(data.created_at ?? ''),
    updated_at: String(data.updated_at ?? ''),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = 'Não foi possível concluir a operação.';

    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || message;
    } catch {
      // ignora erro de parse
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function listIdeas(): Promise<Idea[]> {
  const data = await request<any[]>('/ideas');
  return data.map(normalizeIdea);
}

export async function getIdeaById(id: string): Promise<Idea> {
  const data = await request<any>(`/ideas/${id}`);
  return normalizeIdea(data);
}

export async function createIdea(payload: CreateIdeaInput): Promise<Idea> {
  const data = await request<any>('/ideas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return normalizeIdea(data);
}

export async function updateIdea(
  id: string,
  payload: UpdateIdeaInput,
): Promise<Idea> {
  const data = await request<any>(`/ideas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return normalizeIdea(data);
}

export async function deleteIdea(id: string): Promise<void> {
  await request<void>(`/ideas/${id}`, {
    method: 'DELETE',
  });
}
