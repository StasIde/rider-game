class TrickApi {
  constructor(baseUrl = "http://localhost:3003/api/tricks") {
    this.baseUrl = baseUrl;
  }

  async fetchJson(url, options = {}) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  getAll() {
    return this.fetchJson(this.baseUrl);
  }

  create(trick) {
    return this.fetchJson(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trick),
    });
  }

  delete({ id = "" }) {
    return this.fetchJson(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}

export const trickApi = new TrickApi();
