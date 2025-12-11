// Greeting messages for the Sandbox page
// Messages rotate daily based on the date, and change based on time of day

// Time periods:
// - morning: 5am - 12pm
// - afternoon: 12pm - 5pm
// - evening: 5pm - 9pm
// - night: 9pm - 5am

export const greetings = {
  morning: [
    "someone's up early...",
    "what brings you here so early?",
    "up before noon, impressive",
    // Add more morning greetings here...
  ],
  afternoon: [
    "lunch and munch",
    "midday visitor",
    "procrastinating from work?",
    // Add more afternoon greetings here...
  ],
  evening: [
    "quick doomscroll time",
    "avoiding responsibilities?",
    "go sleep",
    // Add more evening greetings here...
  ],
  night: [
    "nighttime stalking?",
    "what could you possibly be awake for...",
    "go sleep already",
    // Add more night greetings here...
  ],
};

export type TimeOfDay = keyof typeof greetings;

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// Placeholder queries for the input box
// Rotate based on time of day to match the greeting above
export const placeholderQueries = {
  morning: [
    "Make me a fun game to play",
    "Draw a beautiful landscape",
    "Make me a meme",
  ],
  afternoon: [
    "Make me a meme",
    "Draw a beautiful landscape",
    "Make me a fun game to play",
  ],
  evening: [
    "Make me a meme",
    "Draw a beautiful landscape",
    "Make me a fun game to play",
  ],
  night: [
    "Make me a meme",
    "Draw a beautiful landscape",
    "Make me a fun game to play",
  ],
};

export function getGreeting(): string {
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = getTimeOfDay(hour);
  
  // Use day of year to rotate through messages
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const messages = greetings[timeOfDay];
  const index = dayOfYear % messages.length;
  
  return messages[index];
}

export function getPlaceholderQuery(): string {
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = getTimeOfDay(hour);
  
  // Use day of year to rotate through queries (10 per time period)
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const queries = placeholderQueries[timeOfDay];
  const index = dayOfYear % queries.length;
  
  return queries[index];
}
