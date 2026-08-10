# How to Land in the Primary Inbox (Klaviyo Verification)

Your "Welcome Email" is currently landing in **Promotions** because it is triggered by a **Marketing List Subscription**. Gmail treats these as newsletters by default.

To force this into the **Primary Inbox**, you must make the email look like a personal letter, not a marketing blast.

## 1. The "Plain Text" Strategy (Most Effective)
Go to your Klaviyo Dashboard > **Flows** > **Welcome Series**.
Edit the first email in the sequence and apply these changes:

*   **Switch Editor:** Use the **Text Only** or **Hybrid** editor, not the Drag-and-Drop builder.
*   **Remove Images:** Delete the logo header and any product images.
*   **Simplify Layout:** No columns, no colored backgrounds, no buttons. Use a simple text link for the Call to Action.
*   **Personal "From" Name:** Change "The Vault" to specific person, e.g., "Carl from The Vault".
*   **Subject Line:** Keep it boring. "Welcome" or "Your access" performs better than "WELCOME TO THE VAULT!!! 🚀".

## 2. The "Reply" Trigger (High Trust)
In the body of the email, ask a question:
> *"Reply to this email with your shirt size so I can customise your first drop."*
> *"Which team are you looking for? Reply and let me know."*

If a user replies, Gmail permanently whitlists you to their Primary Inbox.

## 3. Technical Alternative (Code Change Required)
If the above does not work, we can change the website code to use Klaviyo's **Transactional Email API**.
*   **Pros:** Treated as a system notification (like a password reset), highly likely to hit Primary.
*   **Cons:** Does not automatically subscribe them to the weekly newsletter (requires extra compliance steps).
*   **Requirement:** You need to create a specific template in Klaviyo and provide me with the **Template ID**.
