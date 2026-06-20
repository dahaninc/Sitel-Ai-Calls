# Sitel AI — Automated Distribution Playbook
## Target: UK Shopify eCommerce Brands

**Goal:** Build a system that finds, qualifies, and contacts 50+ warm prospects per week with minimal manual effort — generating 3–5 booked demos per week by month 2.

---

## The Stack (£427/month total)

```
SIGNAL LAYER          ENRICHMENT LAYER        OUTREACH LAYER         NURTURE LAYER
─────────────         ────────────────        ──────────────         ─────────────
Trustpilot  ──────►  Clay.com         ──────► Instantly.ai   ──────► LinkedIn Ads
LinkedIn    ──────►  (score + enrich)  ──────► Expandi.io     ──────► Content posts
BuiltWith   ──────►                           LinkedIn DMs           Email list
```

---

## Layer 1 — Signal Detection

You're not cold prospecting. You're finding brands that are already in pain, right now.

### Signal A: Trustpilot CS Complaints

**Manual version (free, week 1):**
1. Go to uk.trustpilot.com/categories/online_fashion (or homewares, beauty, etc.)
2. Filter: 2.5–4.0 stars
3. Read reviews — look for: "no answer", "waited", "can't get through", "ignored"
4. Log company name, URL, Trustpilot rating, review quotes in a spreadsheet

**Automated version (Clay, week 2+):**
- Use Clay's Trustpilot enrichment to scrape reviews at scale
- Filter: rating 2.8–3.8 AND review keywords match ["wait", "response", "phone", "answer"]
- Output: company name, website, estimated volume, contact name

**Target:** 20 qualifying companies per week from this signal alone.

### Signal B: CS Job Postings on LinkedIn

**Manual version (free):**
1. LinkedIn search: "customer service advisor" + "UK" + posted this week
2. Filter by: Retail / Consumer Goods, 20–200 employees
3. Go to the company page → find Founder/COO/Head of Ops

**Automated version (Sales Navigator + Clay):**
- Sales Navigator saved search: job title contains "Customer Service" OR "Customer Support", industry = Retail, headcount 20–200, posted last 7 days
- Alert fires → feeds into Clay → enriches with company domain, decision-maker name, email

**Target:** 15–20 companies per week.

### Signal C: BuiltWith Shopify Filter

Use BuiltWith.com to export UK companies running Shopify with >1,000 monthly visits. Cross-reference with Trustpilot data. Confirms platform without guessing.

**Free alternative:** Check store footer for "Powered by Shopify" or view source for `cdn.shopify.com`.

---

## Layer 2 — Enrichment (Clay.com)

For every prospect flagged by signals, Clay automatically:

1. **Confirms Shopify** via BuiltWith integration
2. **Finds decision maker** — searches LinkedIn for Founder/COO/Head of Operations at the company
3. **Finds email** — uses Hunter.io, Apollo, or Dropcontact waterfall
4. **Pulls Trustpilot data** — rating + relevant review quotes for personalisation
5. **Scores the lead** — uses the ICP scoring framework (0–10)
6. **Generates personalised first line** — AI writes an opening sentence referencing their specific Trustpilot reviews or job posting
7. **Routes to outreach** — score 7+ goes to Instantly (email), score 8+ also to Expandi (LinkedIn)

**Clay table columns:**
- Company name, website, Shopify confirmed (Y/N)
- Contact name, title, LinkedIn URL, email
- Trustpilot rating, CS complaint quotes
- ICP score (auto-calculated)
- Outreach status, reply, booked demo (Y/N)

---

## Layer 3 — Outreach Automation

### Email (Instantly.ai)

**Sequence: "WISMO Automation" — 3 emails over 7 days**

Email 1 — Day 1:
- Subject variants (A/B): rotate 3 options from outreach-messages.md
- Opening line: Clay AI-generated, references their specific Trustpilot review
- Body: WISMO pain → Sitel AI solution → social proof → demo CTA
- Personalisation tokens: {{company_name}}, {{first_name}}, {{trustpilot_quote}}, {{similar_client}}

Email 2 — Day 3:
- Short. Just asks: "Did you call the demo?"
- One-liner reply CTA

Email 3 — Day 7:
- Final. Removes pressure. Leaves door open.
- Asks one qualifying question: "How many calls/month does [BRAND] handle?"

**Instantly settings:**
- Send limit: 30–40 emails/day per inbox (warm up first)
- Sending window: Mon–Fri, 8am–5pm UK time
- Reply detection: pause sequence on reply
- Bounce rate limit: pause campaign if >3%

**Warm up:** Use Instantly's email warmup for 2 weeks before launching. Protects deliverability.

### LinkedIn (Expandi.io)

**Sequence: "Shopify CS Pain" — 3 touches over 10 days**

Touch 1 — Day 1: Connection request
- Note (300 chars max): personalised, references specific signal (hiring post or Trustpilot)

Touch 2 — Day 4 (on acceptance): Opening message
- Uses Variant 1 or 2 from outreach-messages.md
- Includes demo phone number as CTA

Touch 3 — Day 10 (if no reply): Follow-up
- "Did you get a chance to call the demo? Takes 60 seconds."

**Expandi settings:**
- Max 30 connection requests/day (LinkedIn limit compliance)
- Delay between actions: 2–5 minutes (human-like)
- Stop sequence on reply

**Combined weekly output:**
- 150 emails sent (Instantly)
- 30 LinkedIn connections sent (Expandi)
- Expected: 3–6% positive reply rate = 5–9 conversations/week by week 3

---

## Layer 4 — Nurture (for non-responders)

### LinkedIn Retargeting Ads

**Objective:** Stay visible to prospects who saw your outreach but didn't reply. Most B2B deals need 5–8 touchpoints.

**Campaign setup:**
- Platform: LinkedIn Campaign Manager
- Audience: Upload your prospect list as a Matched Audience (Company name + email CSV from Clay)
- Ad format: Single image or video
- Budget: £10–£15/day
- Run time: Continuous (pause for non-ICP audiences monthly)

**Ad creative rotation (change every 2 weeks):**
- Ad 1: "65% of your CS calls are WISMO. We handle them all automatically."
- Ad 2: Video testimonial or demo clip (record your screen using Loom + Retell demo)
- Ad 3: "One UK fashion brand replaced 1.5 CS agents. Here's how." → link to case study
- Ad 4: Black Friday urgency (August–October only): "Is your phone line ready for November?"

**Expected:** 3–5 warm inbound enquiries per month from people who saw your outreach + ads.

### LinkedIn Content (organic — 3 posts/week)

Post types that get traction with eCommerce founders:

**Monday — Data/insight:**
> "We analysed 10,000 inbound calls from UK Shopify brands.
> 71% were order status queries.
> 14% were return requests.
> 8% were delivery complaints.
> Only 7% needed a human.
> Your CS team is spending 93% of their time on things that could be automated."

**Wednesday — Story/case study:**
> "A Shopify fashion brand was getting 2,200 calls a month.
> Their CS team of 3 was drowning.
> We went live in 6 days.
> Month 1: 68% call deflection.
> Their team now handles 700 calls — the complex ones that actually matter.
> [Story continues in comments]"

**Friday — Provocative question or hook:**
> "Hot take: hiring a customer service agent in 2025 is a panic decision.
> The role exists to answer the same 8 questions on repeat.
> AI handles all 8. Picks up in under a second. Works Bank Holidays.
> The agent you hire will spend 18 months doing that. Then leave.
> [Thoughts?]"

**Content goal:** 500–2,000 impressions per post from eCommerce founders. Even 1 inbound DM per week compounds into 50+ conversations/year.

---

## Layer 5 — Shopify Ecosystem Channels

These are distribution channels baked into where your buyers already spend time.

### Shopify App Store Listing
- Build a simple Shopify app (or landing page that looks like one) that connects to Sitel AI
- Listed under "Customer Service" category
- Merchants searching for CS solutions find you organically
- **Effort:** Medium (4–8 hours to build a basic listing app). Worth doing in month 2.

### Shopify Partners Program
- Sign up as a Shopify Partner (free)
- Get listed as a service provider
- Shopify merchants actively search for Partners when they need operational help

### eCommerce Communities (seed manually first)
- **UK Ecommerce Community** (Facebook group, 50k+ members): share insights, not pitches
- **Shopify UK Merchants** (Facebook): answer questions about CS operations
- **eCommerce Masterminds** (various Slack/WhatsApp groups): provide value, get referrals
- **r/Entrepreneur** and **r/ecommerce** (Reddit): case study posts work well

**Rule:** Never pitch directly in communities. Share data, insights, and results. DM people who engage.

### Partnership Channels
- **Shopify Plus Partners** — agencies that build stores for brands in your ICP. They refer operational tools.
- **3PL / Fulfilment companies** — they talk to eCommerce brands daily and hear CS complaints constantly. Revenue share deal: they refer clients, you pay 10% of first-year revenue.
- **eCommerce accountants** — firms like Osome or Crunch serve Shopify brands. Cross-referral relationship.

---

## Weekly Rhythm (once fully set up)

| Day | Action | Time |
|---|---|---|
| Monday | Review new Trustpilot signals + CS job postings | 30 min |
| Monday | Approve new leads in Clay (check score, edit AI first line) | 30 min |
| Tuesday | LinkedIn connection requests reviewed + Expandi queue checked | 15 min |
| Wednesday | Publish LinkedIn content post | 20 min |
| Wednesday | Reply to any LinkedIn/email responses | 30 min |
| Thursday | Review Instantly campaign metrics (open rate, reply rate) | 15 min |
| Friday | Publish LinkedIn content post | 20 min |
| Friday | Review week: demos booked, pipeline, A/B test winners | 20 min |

**Total active time per week: ~3 hours. Everything else runs automatically.**

---

## Month-by-Month Ramp

### Month 1 — Manual foundation
- Tools: LinkedIn free + Sales Navigator trial + Instantly (email only)
- Volume: 50 emails/week, 20 LinkedIn DMs manual
- Goal: 2 discovery calls booked, 1 client signed
- Spend: £79 (Sales Nav) + £37 (Instantly) = £116/mo

### Month 2 — Automation layer
- Add Clay + Expandi
- Volume: 150 emails/week, 30 LinkedIn connections/day automated
- Goal: 5 discovery calls/week, 2 clients signed
- Spend: £427/mo
- LinkedIn ads launched: £10/day

### Month 3 — Scale + referrals
- First client case study published
- Courier company outreach begins (V2)
- Shopify app listing live
- Partner channel activated (1 3PL, 1 agency)
- Goal: 8 discovery calls/week, pipeline of 15+ qualified prospects
- MRR target: £12,000+ (3–4 clients)

---

## KPIs to Track Weekly

| Metric | Target by month 2 |
|---|---|
| Emails sent/week | 150 |
| Email open rate | >40% |
| Email reply rate | >5% |
| LinkedIn connections sent/week | 150 |
| LinkedIn acceptance rate | >25% |
| Positive replies/week | 8–12 |
| Discovery calls booked/week | 3–5 |
| Demo → proposal rate | >50% |
| Proposal → close rate | >30% |
| New MRR/month | £3,400+ (1 Growth client) |
