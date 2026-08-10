---
description: Generates a new weekly sports memorabilia article based on current news trends.
triggers:
  - new-article-activate
  - generate new article
  - weekly post
---

# Workflow: Generate Weekly Article

This workflow is triggered when the user types `new-article-activate`. It automates the creation of a timely, SEO-optimized blog post.

## Steps

1.  **Analyze Context**
    *   Check the current date.
    *   Acknowledge the user's request to generate a new article.

2.  **Trend Discovery (Search)**
    *   Perform a web search for "trending sports memorabilia news [current month year]", "upcoming major sports events [current month year]", or "record breaking sports auction [current month year]".
    *   Select the most relevant topic that appeals to *collectors* and *investors* (e.g., a specific auction, a player retiring, a major tournament).

3.  **Content Drafting (Internal)**
    *   Draft a new `BlogPost` object.
    *   **Constraint 1 (Language):** STRICT British English (colour, realised, centre, 's' instead of 'z').
    *   **Constraint 2 (Tone):** "Smart pub talk" – authoritative but accessible.
    *   **Constraint 3 (SEO):** Generate `seo_title`, `seo_description`, and `seo_keywords`.
    *   **Constraint 4 (Structure):** Use `<h2>` and `<h3>` tags for readability. No generic AI bullet points.
    *   **Constraint 5 (ID):** Increment the numeric ID from the last article in `src/data/articles.ts`.

4.  **Implementation**
    *   Read `src/data/articles.ts` to find the last ID.
    *   Use `multi_replace_file_content` (or `replace_file_content` if appropriate) to append the new article object to the `articles` array.
    *   Ensure the `// End of articles` or closing bracket is handled correctly so the file syntax remains valid typescript.

5.  **Verification**
    *   Confirm to the user that the article is live.
    *   Provide a brief summary of the topic chosen and why.
