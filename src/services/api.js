const API_URL = "https://chronos-history-app.onrender.com/api/topics";

// 1. Ambil semua topik (Disetkan supaya tidak meletupkan React UI jika API error)
export const getTopics = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error("Server error:", res.statusText);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching topics:", err);
    return [];
  }
};

// 2. Ambil 1 topik mengikut ID
export const getTopicById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching topic:", err);
    return null;
  }
};

// 3. Simpan / Kemaskini topik
export const saveTopic = async (topic) => {
  try {
    const isEdit = Boolean(topic.id);
    const url = isEdit ? `${API_URL}/${topic.id}` : API_URL;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topic),
    });
    if (!res.ok) throw new Error("Gagal menyimpan topik");
    return await res.json();
  } catch (err) {
    console.error("Error saving topic:", err);
    return null;
  }
};

// 4. Padam topik
export const deleteTopic = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal memadam topik");
    return await res.json();
  } catch (err) {
    console.error("Error deleting topic:", err);
    return null;
  }
};

// 5. Upload Gambar ke Render Backend
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://chronos-history-app.onrender.com/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Gagal memuat naik gambar");
    const data = await res.json();
    return data.imageUrl;
  } catch (err) {
    console.error("Error uploading image:", err);
    return null;
  }
};