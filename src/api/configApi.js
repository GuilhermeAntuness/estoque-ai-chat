// Lightweight API client for configuration endpoints using fetch

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

export async function getConfig() {
  const response = await fetch(`${API_BASE_URL}/config/`, {
    method: "GET",
  });
  return handleResponse(response);
}

export async function saveConfig(data) {
  const response = await fetch(`${API_BASE_URL}/config/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export { API_BASE_URL };


