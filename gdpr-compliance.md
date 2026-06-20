# GDPR Compliance Pack
## Project Sitel — AI Voice Agent Legal Compliance (UK)

**Jurisdiction:** United Kingdom (UK GDPR + Data Protection Act 2018)
**Last updated:** June 2026
**Applies to:** Sitel AI and all client deployments

> **Disclaimer:** This document is a practical compliance guide, not legal advice. For high-risk deployments or where significant personal data processing is involved, consult a qualified data protection solicitor. ICO guidance at ico.org.uk is authoritative.

---

## 1. AI DISCLOSURE SCRIPT

Under UK GDPR and the ICO's guidance on AI transparency, callers must be informed they are interacting with an AI system. This must happen at the start of the call, before any personal data is collected.

### Mandatory Disclosure (read at call start)

**Minimum compliant version:**
> "Hello, I'm an AI assistant — I'm not a human agent. I'll be helping you today, and this call may be recorded for quality and training purposes. If you'd prefer to speak with a human at any time, just let me know."

**Branded version (recommended — insert your client's agent name):**
> "Hello, thank you for calling [BRAND NAME] customer support. I'm Aria, an AI assistant — just so you know, I'm not a human agent. This call may be recorded. If at any point you'd rather speak to a person, just say 'speak to a human' and I'll connect you straight away. How can I help you today?"

**Why this wording works:**
- Discloses AI nature clearly ("I'm an AI assistant / I'm not a human agent")
- Informs of recording ("this call may be recorded")
- Provides opt-out to human ("if you'd prefer to speak with a human")
- Does not require explicit "I consent" response — continued engagement after disclosure constitutes implicit consent for general queries

### When Explicit Consent Is Required

You need **explicit, recorded consent** (a verbal "yes") before:
- Recording sensitive personal data (health, financial, employment status)
- Storing call content beyond the conversation itself
- Using call data for training AI models

For standard eCommerce support (order tracking, returns), implicit consent after disclosure is sufficient.

---

## 2. CALL RECORDING CONSENT LANGUAGE

### Scenario A: Recording for quality monitoring (most common)

Include in your AI disclosure script:
> "This call may be recorded for quality and training purposes."

This is sufficient for legitimate interest purposes where recording is proportionate to the business need (customer service quality).

**Add to your website privacy policy:**
> "Customer service calls may be recorded for quality assurance and staff training purposes. Recordings are retained for [30] days and then permanently deleted unless required for an ongoing investigation or dispute."

### Scenario B: Recording used to resolve disputes

If you intend to use recordings as evidence in billing disputes, complaints, or legal proceedings, add:
> "Calls are recorded and may be used to assist in resolving any disputes that arise."

### Scenario C: Recording used to train AI models

This requires **explicit consent** — implicit disclosure is not enough:
> "We'd like your permission to use this call recording to help improve our AI systems. Can I confirm you're happy for this call to be used for that purpose?" [Wait for "yes" or "no".]

If they say no: recording can still happen for quality monitoring, but must not be used for AI training. Log the objection.

---

## 3. DATA PROCESSING AGREEMENT TEMPLATE

*This is a template for the DPA between Sitel AI (Data Processor) and the Client (Data Controller). Both parties sign this before go-live.*

---

**DATA PROCESSING AGREEMENT**

**Between:**
[CLIENT COMPANY NAME] ("Controller")
[ADDRESS]
Registered Company No: [NUMBER]

**And:**
Sitel AI ("Processor")
[ADDRESS]
Registered Company No: [NUMBER]

**Date:** [DATE]

---

**1. Subject Matter**

The Processor will process personal data on behalf of the Controller in connection with the provision of AI voice agent services as described in the accompanying services agreement.

**2. Nature and Purpose of Processing**

The Processor will process personal data for the purpose of:
- Handling inbound customer telephone calls on behalf of the Controller
- Retrieving order and account information from the Controller's systems
- Creating call transcripts and summaries
- Routing calls to the Controller's human agents where required
- Generating analytics and reporting for the Controller

**3. Categories of Data Subjects**

Customers and prospective customers of the Controller who contact the Controller by telephone.

**4. Categories of Personal Data**

- Names
- Phone numbers (via call metadata)
- Order numbers and purchase history
- Delivery addresses (where provided during a call)
- Voice recordings
- Call transcripts
- Complaint details

**5. Special Category Data**

The Processor shall not intentionally collect special category data. If a data subject volunteers special category data (health information, financial hardship, etc.) during a call, the Processor's AI system will escalate the call to a human agent immediately.

**6. Processor Obligations**

The Processor agrees to:

a) Process personal data only on documented instructions from the Controller, including with regard to transfers of personal data

b) Ensure persons authorised to process personal data are bound by appropriate confidentiality obligations

c) Implement appropriate technical and organisational measures to ensure security of processing, including:
   - Encryption of data in transit (TLS 1.2 minimum)
   - Encryption of data at rest (AES-256)
   - Access controls limited to personnel with a need to know
   - Regular security assessments

d) Not engage sub-processors without prior written consent of the Controller. Current sub-processors: OpenAI (LLM processing), ElevenLabs (voice synthesis), Twilio (telephony), Retell AI (conversation management). Full sub-processor list provided on request.

e) Assist the Controller in fulfilling its obligations to respond to data subject rights requests

f) Delete or return all personal data at the end of the service provision, at the Controller's choice

g) Provide all information necessary to demonstrate compliance with GDPR Article 28

**7. Data Retention**

Call recordings: retained for [30] days from date of call, then automatically deleted.
Call transcripts: retained for [30] days from date of call, then automatically deleted.
Aggregate analytics (no personal data): retained indefinitely.
Retention period may be modified by written agreement.

**8. Data Location**

All personal data is processed and stored within the United Kingdom and European Economic Area only. No transfers to third countries.

**9. Data Subject Rights**

The Processor will, within 48 hours, notify the Controller of any data subject rights request (subject access, erasure, rectification, restriction) received directly by the Processor, and will provide reasonable assistance to the Controller in responding.

**10. Data Breach Notification**

The Processor will notify the Controller without undue delay, and in any event within 24 hours, after becoming aware of a personal data breach affecting data processed under this agreement. Notification will include the nature of the breach, categories and approximate number of data subjects and records affected, likely consequences, and measures taken or proposed.

**11. Audit Rights**

The Controller may, on 14 days' written notice, audit or inspect the Processor's data processing activities. The Processor will provide all reasonable cooperation. The cost of any such audit to be borne by the Controller unless a material breach is discovered.

**Signed by the Controller:** _________________________ Date: ___________

**Signed by the Processor:** _________________________ Date: ___________

---

## 4. ICO REGISTRATION CHECKLIST

**Who needs to register:** Any organisation that processes personal data that does not qualify for an exemption. Most businesses must register. Annual fee is £40–£2,900 depending on size. Small businesses (under 10 employees and under £632K turnover): £40/year.

**Register at:** ico.org.uk/registration

### Steps

- [ ] Go to ico.org.uk/registration
- [ ] Select "Register or renew" → "Data Controller" (Sitel AI registers as a Data Controller for its own business data AND as a Data Processor for client data — register for both)
- [ ] Provide your company name, registered address, and company number
- [ ] Describe your processing activities: "AI voice agent services — processing customer telephone call data on behalf of business clients"
- [ ] Pay the £40 fee (card payment)
- [ ] Receive your ICO Registration Number — this goes on your privacy policy and DPA

**Your clients** also need to be registered (or already are). Check by searching ico.org.uk/ESDWebPages/Search before signing them up.

---

## 5. CLIENT CONTRACT — MANDATORY DATA HANDLING CLAUSES

Include the following in every client services agreement:

### 5.1 Data Controller Responsibility

> "The Client acknowledges that it is the Data Controller in respect of all personal data processed by Sitel AI on the Client's behalf. The Client is responsible for ensuring it has a lawful basis for collecting and using customer personal data, including voice recordings and call transcripts."

### 5.2 AI Disclosure Obligation

> "The Client agrees to ensure that the AI disclosure script provided by Sitel AI (or a compliant equivalent approved in writing by Sitel AI) is included at the start of every call handled by the AI agent. The Client may not remove or modify the AI disclosure without written consent from Sitel AI."

### 5.3 Data Processing Agreement

> "The parties agree that the Data Processing Agreement attached as Schedule [X] to this agreement governs all processing of personal data by Sitel AI on behalf of the Client. Both parties shall comply with their respective obligations under UK GDPR and the Data Protection Act 2018."

### 5.4 Prohibited Data Types

> "The Client must not configure the Sitel AI system to intentionally collect, store, or process special category personal data (including health data, financial account data, or biometric data) without the prior written consent of Sitel AI and a separate assessment of appropriate safeguards."

### 5.5 Breach Response

> "Each party shall notify the other within 24 hours of becoming aware of any personal data breach involving data processed under this agreement. Both parties shall cooperate to investigate, contain, and report any breach as required under UK GDPR."

### 5.6 Sub-processors

> "The Client acknowledges and consents to Sitel AI's use of the following sub-processors: Retell AI, OpenAI, ElevenLabs, and Twilio. Sitel AI will maintain a current list of sub-processors and will provide 14 days' written notice before adding new sub-processors."

---

## 6. PRIVACY POLICY TEMPLATE LANGUAGE

Add this section to your client-facing privacy policy (or provide it to clients to add to theirs):

---

**Automated Customer Service (AI Voice Agent)**

We use an AI voice system to handle some of our inbound customer service calls. This system is provided by Sitel AI [sitelai.com].

When you call our customer service number, you will be informed at the start of the call that you are interacting with an AI system. You can request to speak with a human agent at any time.

**What data is collected during AI-handled calls:**
- Your phone number (via call metadata)
- The content of your call (voice recording and transcript)
- Any personal information you provide during the call (name, order number, delivery address)

**How we use this data:**
- To resolve your customer service query
- To maintain a record of our interaction for quality purposes
- To improve our service

**How long we keep it:**
- Call recordings and transcripts: 30 days from the date of the call
- After 30 days, recordings and transcripts are permanently deleted

**Your rights:**
You can request a copy of any call transcript, ask for your data to be deleted, or object to our processing at any time by contacting [DATA PROTECTION EMAIL].

---

## 7. QUICK COMPLIANCE CHECKLIST — GO-LIVE

Before your first live call:

- [ ] AI disclosure script included at start of every call
- [ ] Call recording language confirmed in disclosure
- [ ] ICO registration complete (Sitel AI: confirmed. Client: check)
- [ ] Data Processing Agreement signed by both parties
- [ ] Client privacy policy updated to mention AI call handling
- [ ] Sub-processor list provided to client
- [ ] Data retention period confirmed (default: 30 days)
- [ ] Escalation trigger confirmed for sensitive data / distressed callers
- [ ] No special category data being collected
- [ ] Call recordings stored on UK/EEA servers only
- [ ] Breach notification contact confirmed on both sides
