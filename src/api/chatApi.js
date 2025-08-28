// Lightweight API client for chat endpoints using fetch

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; // use Vite proxy in dev

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && (data.message || data.detail)) {
        errorMessage = data.message || data.detail;
      }
    } catch (_e) {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function sendMessage(mensagem, session) {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mensagem, session }),
  });
  return handleResponse(response);
}

export { API_BASE_URL };


