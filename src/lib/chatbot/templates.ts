
export const RESPONSES = {
  GREETING: [
    "Hello! Welcome to the premium sports lounge. How can I assist you today? 🏆",
    "Hi there! Looking for a piece of history? I'm here to help.",
    "Welcome! From signed shirts to legendary boots, what are you hunting for?",
    "Good day! Ready to find the perfect addition to your collection?"
  ],
  PLAYER_FOUND: [
    "Great news! We have {name} {types} available! 🎯",
    "Excellent choice. Here are our finest items for {name}.",
    "You have great taste! Check out these {name} pieces.",
    "Found them! Here is our current stock for {name}."
  ],
  TEAM_FOUND: [
    "Brilliant choice! 🔴 Here are our best {team} items.",
    "A true fan! Here's what we have for {team}.",
    "Excellent. displaying our top {team} memorabilia.",
    "Straight from the stadium to you. Here are our {team} collectibles."
  ],
  OUT_OF_STOCK: [
    "We don't currently have {name} in stock. 😔",
    "It seems {name} is out of stock at the moment.",
    "Apologies, we've sold out of {name} items recently."
  ],
  UNKNOWN_INPUT: [
    "I'm not sure I caught that. Could you say it again?",
    "I didn't quite understand. Try asking for a player, team, or sport.",
    "My apologies, I missed that. Are you looking for specific memorabilia?",
    "I'm still learning! Could you try rephrasing your request?"
  ],
  SHOW_MORE: [
    "Here are some more items you might like!",
    "Digging deeper... check these out.",
    "There's more where that came from!",
    "Here is the next set of results."
  ]
};

export function getResponse(key: keyof typeof RESPONSES, params: Record<string, string> = {}): string {
  const templates = RESPONSES[key];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  let response = template;
  for (const [param, value] of Object.entries(params)) {
    response = response.replace(`{${param}}`, value);
  }
  return response;
}
