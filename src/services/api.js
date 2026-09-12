const API_URL = "http://localhost:5000/api/topics";

// 1. Ambil semua topik dari database
export const getTopics = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (err) {
    console.error("Error fetching topics:", err);
    return [];
  }
};

// 2. Ambil 1 topik mengikut ID
export const getTopicById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching topic:", err);
    return null;
  }
};

// 3. Simpan / Kemaskini topik ke database
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
    return await res.json();
  } catch (err) {
    console.error("Error saving topic:", err);
  }
};

// 4. Padam topik dari database
export const deleteTopic = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return await res.json();
  } catch (err) {
    console.error("Error deleting topic:", err);
  }
};
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.imageUrl;
};