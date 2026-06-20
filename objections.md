# Objection Handling Guide
## Project Sitel — Every Objection, Scripted

**How to use this:** Memorise the one-line reframe for each objection. Use the full script when you need to go deeper. Never get defensive — objections are buying signals.

---

## OBJECTION 1: "What if the AI gets it wrong?"

**One-line reframe:** "It makes fewer mistakes than a new hire on Day 1 — and we fix it instantly when it does."

**Full response:**

> "That's a fair concern, and honestly it's the right one to ask. Here's how we handle it: the agent only does things it's been explicitly instructed to do. It doesn't guess. If a customer asks something outside its scope, it says 'I'll need to pass you to a member of the team for that' and escalates immediately. It doesn't bluff.

> And when something does go wrong — which happens, just like with human agents — we get notified, we review the transcript, and we update the prompt the same day. The key difference from a human agent making a mistake is that we fix the mistake permanently. Your human agents can make the same error 1,000 times. The AI makes it once.

> We also recommend keeping call transcripts reviewed in Week 1 — that's usually when we catch any edge cases and fix them before they become a pattern."

---

## OBJECTION 2: "Our customers want to speak to humans"

**One-line reframe:** "Your customers want their problem solved in under 2 minutes. Most don't care how."

**Full response:**

> "There's a lot of research on this, and it's more nuanced than you might expect. What customers actually want is: a fast answer, a correct answer, and not to be kept on hold. When those three things happen, the vast majority don't care whether it's a human or an AI.

> The experience breaks down when AI *sounds* robotic, gives wrong information, or makes them repeat themselves. Our agent doesn't do any of those things. In blind tests, a significant proportion of callers can't tell it's an AI.

> And critically — any customer who *does* want a human gets one, immediately. The escalation trigger is instant. So you're not replacing the human experience, you're making sure a human is available for the customers who genuinely need one — rather than wasting their time on order tracking queries that take 90 seconds to resolve."

---

## OBJECTION 3: "What about GDPR / call recording?"

**One-line reframe:** "We've built the compliance in — you just need to review the DPA."

**Full response:**

> "We take this seriously and we've built GDPR compliance in from Day 1, not bolted on afterwards. Here's what we do:

> The agent discloses AI involvement at the start of every call — 'I'm an AI assistant' — and obtains consent for call recording. That covers both the AI transparency requirement and the recording consent requirement under UK GDPR.

> All data is processed under a Data Processing Agreement that we provide as standard. Call recordings are stored on UK/EU servers only. Transcripts are retained for 30 days by default — or whatever retention period you specify in your own privacy policy.

> You'll also need to update your privacy policy to mention AI call handling, which takes about 20 minutes. We provide the template language.

> We also encourage you to register with the ICO if you haven't already — that's a £40/year exercise and is technically required for any organisation processing personal data.

> Would it help if I sent you our GDPR pack? It covers everything you'd need on Day 1."

---

## OBJECTION 4: "We already use Zendesk / Freshdesk / Gorgias"

**One-line reframe:** "Good — we integrate with all of them. This sits on top of your existing setup."

**Full response:**

> "We're not asking you to replace anything. We sit in front of your phone line and handle the Tier-1 calls that shouldn't be consuming your agents' time — and every interaction gets logged directly into [HELPDESK] as a ticket with a full transcript.

> So your agents still work from Zendesk / Freshdesk / Gorgias. They just open their queue in the morning and instead of seeing 80 tickets from 'where's my order', they see 20 tickets that actually need human attention. The AI has handled the rest overnight.

> The integration is straightforward — we connect via API, pull order data from your CRM, and push call summaries back to your helpdesk automatically. Your team doesn't need to change how they work at all."

---

## OBJECTION 5: "The latency sounds like it would be noticeable"

**One-line reframe:** "Try the demo — most people can't tell the difference."

**Full response:**

> "It's a legitimate concern and it was a bigger problem two years ago. Modern LLM + voice synthesis pipelines have got to sub-500ms response times — which is within the range of normal human conversational pauses. You can't reliably tell the difference.

> The best way I can answer this is to have you call the demo number right now and experience it yourself. I'll stay on this call while you do it — and I want you to try to trip it up. Interrupt it mid-sentence. Ask an unexpected question. See if there's any lag that feels unnatural. [Give demo number.]

> What did you notice? [Pause for answer.]"

*[If they still object after the demo:]* > "If there's still a latency concern after you've tried it, that's genuinely useful feedback and we can look at whether a lower-latency configuration would work for your use case."

---

## OBJECTION 6: "What happens when it can't handle a call?"

**One-line reframe:** "It escalates to your team instantly — same as a new agent who doesn't know the answer."

**Full response:**

> "The agent is designed to know its own limits. Any call it can't resolve confidently — because the query is outside its scope, because the customer is very upset, or because the customer explicitly asks for a human — it escalates immediately. The transfer takes less than 5 seconds.

> At escalation, it passes a summary to the receiving agent: who the customer is, what their query is, and what's already been attempted. So the human agent doesn't start from zero — they start with context.

> In practice, during Month 1, you'll see somewhere between 30–40% of calls escalate. That's expected — the agent is learning. By Month 2, escalation rate typically drops to 20–30% as we refine the prompts based on real call data. The long-term target is 15–25% escalation, with the rest fully resolved by AI."

---

## OBJECTION 7: "Can we try before we buy?"

**One-line reframe:** "You can call the demo right now. A full pilot requires some setup investment — here's why."

**Full response:**

> "Absolutely — that's what the demo number is for. You can call it right now and experience the agent in a real eCommerce scenario. [Give number.] That will tell you more in 3 minutes than I can tell you in 30.

> In terms of a full paid pilot before committing: I understand the instinct, but here's the challenge. Getting the AI to actually perform for your business — with your products, your CRM, your call flows — requires us to build it. And building it well takes 3–5 days of engineering time. We can't do that speculatively.

> What we can do is offer a 3-month minimum contract instead of locking you in long-term. If by Day 60 the agent isn't achieving at least 50% call deflection, we waive Month 3 entirely — no questions asked. That's our version of a risk-free trial.

> The demo tells you the technology works. The first 30 days tells you it works for your business."

---

## OBJECTION 8: "It's too expensive"

**One-line reframe:** "Compared to what? Let's do the maths together."

**Full response:**

> "I hear you — let's make sure we're comparing the right things. What does your current support setup cost you each month, all in? Salaries, NI, pension, training, management time?

> [Wait for answer.]

> Okay, so let's say that's £[X]/month for [N] agents. Our Growth plan is £3,400/month. In Month 1, you're probably going to need [N-1] agents for escalations — so your combined cost would be £3,400 + [N-1 × monthly agent cost]. That's [£X more or £Y less] than you're spending today.

> But by Month 2–3, as the deflection rate climbs to 65–70%, you can look at whether you need all of those agents — or whether some can be redeployed to other parts of the business.

> The question isn't 'is £3,400 expensive' — it's 'what does it replace?' If it replaces £8,000 in staffing cost, the maths is obvious."

*[If they genuinely can't afford it:]* > "If the Starter plan at £1,800/month is more appropriate for where you are right now, that's a perfectly good place to start. It handles 1,000 calls/month and gives you a working foundation. You can scale the plan as the savings materialise."

---

## GENERAL OBJECTION HANDLING PRINCIPLES

1. **Never argue.** Even if the objection is technically wrong, arguing loses you the deal.
2. **Validate first.** "That's a fair concern" or "I completely understand why you'd ask that" before your response.
3. **Use questions to unpack.** "Can you tell me more about what's behind that concern?" often reveals the real issue.
4. **Use the demo as your proof point.** For any objection about quality, latency, or naturalness — send them to the demo line. It answers better than you can.
5. **Don't over-explain.** Give your answer, check in: "Does that address it?" and move on.
