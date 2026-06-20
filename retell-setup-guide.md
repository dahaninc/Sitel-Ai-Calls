# Retell AI + Twilio Setup Guide
## Get Your Demo Live in Under 4 Hours

**Outcome:** A working AI phone number that prospects can call to hear your demo agent in action.

---

## PHASE 1 — RETELL AI ACCOUNT SETUP (30 minutes)

### Step 1: Sign Up

1. Go to **app.retellai.com**
2. Click "Sign Up" — use your business email
3. Select the **Starter plan** for now (you can upgrade when you land a client)
4. Add a payment method — you'll need a card on file to get a phone number

### Step 2: Create Your First Agent

1. In the left sidebar, click **"Agents"** → **"Create Agent"**
2. Choose **"LLM Agent"** (not the simple scripted option — LLM gives you natural conversation)
3. Name it: `Sitel Demo — eCommerce Support`
4. Set the **LLM Provider** to: **OpenAI**
5. Set the **Model** to: **gpt-4o** (best quality for demos; costs ~$0.005 per minute of conversation)

### Step 3: Configure the Agent Prompt

1. In the agent editor, find the **"System Prompt"** / **"Agent Prompt"** field
2. Copy the entire contents of the **SYSTEM PROMPT** section from `demo-script.md`
3. Replace `[BRAND NAME]` with something that sounds like a real eCommerce brand — suggested: **"Trove London"**
4. Paste into the prompt field
5. Save

### Step 4: Set the Begin Message

In the **"Begin Message"** field, paste:
```
Hello, thank you for calling Trove London customer support. My name is Aria. How can I help you today?
```

### Step 5: Configure Voice Settings

**Recommended ElevenLabs Voice for UK/Neutral Professional Feel:**

| Voice Name | ElevenLabs ID | Notes |
|---|---|---|
| **Charlotte** | `XB0fDUnXU5powFXDhCwa` | Warm, neutral UK female — **top recommendation** |
| **Daniel** | `onwK4e9ZLuTAKqWW03F9` | Professional UK male, clear and authoritative |
| **Freya** | `jsCqWAovK2LkecY7zXl4` | Younger, friendly UK female — good for fashion/lifestyle brands |

To set the voice:
1. In your agent settings, scroll to **"Voice"**
2. Select **"ElevenLabs"** as the provider
3. Click **"Browse Voices"** and search for the voice name above, or paste the ID directly
4. Set **Stability** to `0.6` and **Similarity Boost** to `0.75`
5. Set **Speaking Rate** to `1.0` (natural pace — don't go faster)

### Step 6: Advanced Settings

| Setting | Value | Why |
|---|---|---|
| Responsiveness | `1` | Minimise delay between customer speech and AI response |
| Interruption Sensitivity | `Medium` | Allows natural interruptions without cutting off mid-sentence |
| Ambient Sound | `Office` (low) | Adds authenticity — sounds like a real call centre |
| End Call Phrases | `goodbye, bye, cheers bye, that's all` | Agent hangs up cleanly |
| Max Call Duration | `10 minutes` | Prevents runaway demo calls |

### Step 7: Add End Call Detection

Under **"End Call Detection"**, add:
- "goodbye"
- "thank you, bye"
- "that's all, thanks"

---

## PHASE 2 — TWILIO PHONE NUMBER SETUP (45 minutes)

### Step 1: Create a Twilio Account

1. Go to **twilio.com** → "Sign up for free"
2. Verify your email and phone number
3. When asked what you're building, select "Voice" → "Inbound calls"
4. You get $15.50 free credit — enough for testing

### Step 2: Get a UK Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Set country to **United Kingdom**
3. Filter by capability: **Voice** ✓
4. Choose a **London (020) number** if possible — more trustworthy for UK prospects
5. Cost: approximately **£1/month**
6. Click "Buy" and confirm

> **Pro tip:** A 0800 freephone number costs more (~£2/month) but converts better in outreach because it removes the friction of "will this cost me money to call?"

### Step 3: Connect Twilio to Retell AI

Back in Retell AI:

1. Go to **"Phone Numbers"** in the left sidebar
2. Click **"Import Twilio Number"**
3. You'll see a prompt for:
   - **Twilio Account SID** — find this on your Twilio Console homepage
   - **Twilio Auth Token** — also on the Console homepage (click the eye icon to reveal)
   - **Phone Number** — your new UK number in E.164 format: `+442XXXXXXXXX`
4. Click **"Import"**

Retell will automatically configure the Twilio webhook — you don't need to do this manually.

### Step 4: Assign the Number to Your Agent

1. In Retell, go to your agent → **"Phone Numbers"**
2. Click **"Assign Number"**
3. Select the Twilio number you just imported
4. Click **"Confirm"**

---

## PHASE 3 — TEST YOUR AGENT (30 minutes)

### Internal Test

Before calling from an external phone:

1. In Retell, open your agent and click **"Test Agent"** (the play button)
2. Speak into your microphone and test each scenario:
   - "Where is my order?" → should ask for order number
   - Give order #UK100234 and name "James Patel" → should read out order status
   - "I'd like to make a return" → should go through returns flow
   - "I want to speak to a human" → should escalate
3. Listen for: unnatural pauses, wrong information, awkward phrasing
4. Adjust the system prompt if anything sounds off

### Live Phone Test

1. Call your new Twilio number from your mobile
2. Run through the full script as if you were a customer
3. Record the call (most phones allow this natively or use an app like TapeACall)
4. Listen back and note anything to improve

### Test Scenarios Checklist

- [ ] Agent answers within 2 rings
- [ ] Opening greeting sounds natural
- [ ] Authentication flow works smoothly
- [ ] Order #UK100234 returns correct information
- [ ] Returns flow completes without errors
- [ ] Escalation to human triggers correctly
- [ ] Agent closes the call properly
- [ ] Call lasts no longer than needed

---

## PHASE 4 — SHARE WITH PROSPECTS

### What to Send

When you reach out to prospects, give them the phone number with this framing:

> "We built a live demo of Aria — the AI support agent we'd deploy for your brand. You can call her right now on [NUMBER]. She handles order tracking, returns, and complaints. Try throwing a difficult question at her."

### WhatsApp / Text Message Version

> "Quick one — we built an AI customer support agent that handles 70% of Tier-1 call volume. Live demo: call [NUMBER] now. Try asking about a return or a missing order."

### Tracking Who Calls

In Twilio Console → **Phone Numbers** → your number → **Call Logs**, you can see:
- Who called (number)
- When they called
- How long the call lasted

Longer calls = more engaged prospects. If someone stays on for 3+ minutes exploring the demo, follow up immediately.

---

## TROUBLESHOOTING

| Problem | Solution |
|---|---|
| Agent doesn't answer | Check Twilio number is assigned to agent in Retell |
| Long silence before agent speaks | Reduce "Responsiveness" setting, check OpenAI API key is valid |
| Wrong voice being used | Re-check ElevenLabs voice ID is pasted correctly |
| Agent speaks too fast | Reduce Speaking Rate to 0.9 |
| Call drops after 30 seconds | Check Twilio account has been verified (credit card + phone) |
| Agent repeats itself | Add "don't repeat yourself" to system prompt |

---

## ESTIMATED COSTS FOR DEMO PHASE

| Item | Cost |
|---|---|
| Retell AI (Starter) | $29/month |
| Twilio UK number | ~£1/month |
| Twilio call cost (inbound) | ~$0.0085/minute |
| OpenAI GPT-4o | ~$0.005/minute of conversation |
| ElevenLabs (included in Retell) | Included |
| **Total for 100 demo calls (avg 3 min)** | **~$45** |

This is negligible. Don't let cost be a reason to delay.
