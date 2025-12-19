export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: "Analysis" | "History" | "Education" | "News";
    slug: string;
    imageUrl: string;
}

export const articles: BlogPost[] = [
    {
        id: "1",
        title: "Real vs Fake: How to Spot a Counterfeit Signed Shirt",
        slug: "real-vs-fake-signed-shirt-guide",
        date: "2025-12-10",
        author: "The Authenticator",
        category: "Education",
        excerpt: "Don't get stung by forgeries. We break down the 5 key signs of a fake autograph, from 'dotting' to the pen pressure test.",
        imageUrl: "/placeholder-article-1.jpg",
        content: `
      <h2>The Plague of Fakes</h2>
      <p>The memorabilia market is flooded with fakes. Some estimates suggest up to 80% of "signed" items on general auction sites are largely worthless. As a buyer, your best defence is knowledge.</p>

      <h3>1. The "Dotting" Technique</h3>
      <p>When a forger pauses to check the signature they are copying, they often leave tiny dots of ink at the start or end of strokes. A natural signature flows. It has rhythm. If you see hesitation marks under a loupe, walk away.</p>

      <h3>2. Pen Pressure</h3>
      <p>A real athlete signs quickly. The ink distribution should show speed. Fakes often look "drawn" rather than "signed", with consistent, heavy pressure throughout the signature because the forger is pressing hard to copy a shape.</p>

      <h3>3. The "Too Good to Be True" Provenance</h3>
      <p>"My uncle met Messi in a pub." No, he probably didn't. Authentication relies on concrete proof—photo proof of the signing, or a verifiable chain of custody (like our NFC system).</p>

      <div class="bg-navy/5 p-6 rounded-lg my-8 border-l-4 border-gold">
        <strong>The SportsSigned Standard:</strong> We don't rely on opinion. We rely on witness. Every item we sell was signed in our presence or the presence of a trusted supply partner.
      </div>
    `
    },
    {
        id: "2",
        title: "Market Analysis: Why Did That Messi World Cup Shirt Sell for £5k?",
        slug: "market-analysis-messi-world-cup",
        date: "2025-12-15",
        author: "Market Analyst",
        category: "Analysis",
        excerpt: "We dive into the auction results this week to understand why certain modern shirts are skyrocketing in value.",
        imageUrl: "/placeholder-article-2.jpg",
        content: `
      <h2>The "Goat" Effect</h2>
      <p>This week, a 2022 Argentina Home Shirt signed by Lionel Messi hammered at a specialist auction for over £5,000. For a modern shirt, this is exceptional. Why?</p>

      <h3>1. The "Peak" Narrative</h3>
      <p>Collectors aren't just buying ink; they are buying a story. The 2022 World Cup was Messi's crowning moment. Items associated with that specific timeframe carry a "legacy premium" that a 2018 or 2014 shirt simply does not have.</p>

      <h3>2. Scarcity of "Match Spec"</h3>
      <p>The shirt in question was "Player Spec" (authentic on-pitch version), not a standard "Replica" (Fan store version). Serious investors are moving heavily towards Player Spec items, as they are closer to the actual asset used in the game.</p>

      <h3>Investment Verdict</h3>
      <p>While £5k is high, we believe "Peak Messi" items will outperform the general market over the next decade as he approaches retirement. It is the Michael Jordan effect happening in real-time for football.</p>
    `
    },
    {
        id: "3",
        title: "On This Day: The 1966 World Cup Final",
        slug: "history-1966-world-cup",
        date: "2025-07-30",
        author: "Team Historian",
        category: "History",
        excerpt: "Looking back at the most famous afternoon in English football history, and the rising value of the 'Boys of 66' signatures.",
        imageUrl: "/placeholder-article-3.jpg",
        content: `
      <h2>They Think It's All Over...</h2>
      <p>It is now!</p>
      <p>Today marks the anniversary of England's only World Cup triumph. But for collectors, the '66 squad represents a different kind of tragedy: time.</p>

      <h3>A Disappearing Signature</h3>
      <p>As we lose more members of that heroic squad, complete team signed items are becoming incredibly scarce. A shirt signed by the XI in the 1990s might have cost £300. Today, a pristine example with Geoff Hurst, Bobby Charlton, and Bobby Moore can command significantly higher sums.</p>

      <h3>The "Moore" Factor</h3>
      <p>Bobby Moore's signature is the anchor of any '66 piece. Because he passed away relatively young (1993), his signature is the rarest of the key trio. When evaluating a '66 piece, the condition of Moore's autograph is usually the primary value driver.</p>
    `
    }
];
