const STORAGE_KEY = "chronos_topics";

const initialTopics = [
  {
    id: "1",
    title: "Ancient Egypt",
    period: "c. 3100 BCE – 30 BCE",
    region: "North Africa",
    shortDescription: "One of the world's most influential ancient civilizations, famous for its pharaohs, pyramids and achievements along the Nile.",
    content: "Ancient Egypt was a civilization of ancient North Africa, concentrated along the lower reaches of the Nile River...",
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "2",
    title: "Roman Empire",
    period: "27 BCE – 476 CE",
    region: "Europe & Mediterranean",
    shortDescription: "A vast Mediterranean empire whose laws, engineering, military organization and culture shaped Europe and beyond.",
    content: "The Roman Empire was the post-Republican period of ancient Rome, incorporating large territorial holdings...",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80"
  }
];

export const getTopics = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTopics));
    return initialTopics;
  }
  return JSON.parse(data);
};

export const saveTopic = (topic) => {
  const topics = getTopics();
  if (topic.id) {
    const index = topics.findIndex((t) => t.id === topic.id);
    if (index !== -1) topics[index] = topic;
  } else {
    topic.id = Date.now().toString();
    topics.push(topic);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
};

export const deleteTopic = (id) => {
  const topics = getTopics().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
};