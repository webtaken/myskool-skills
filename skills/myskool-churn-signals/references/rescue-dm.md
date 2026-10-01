# Rescue DMs — structures per signal

A rescue DM is a personal note from the creator, not a retention campaign.
It works when the member feels seen, gets one concrete way forward, and can
answer in one line.

## Principles

- ≤ 80 words, plain text, the member's language, the creator's voice
  (`config.voice`), first name.
- Reference **their own words or post** ("vi que comentaste que no te da la
  vida…"). If the only evidence is silence, reference their last
  contribution instead ("me quedé pensando en tu post sobre…").
- One question they can answer in one line. One offer at most, only from
  `config.saveOffers`.
- No guilt, no "we noticed you've been inactive", no "churn", no countdowns,
  no discounts that aren't configured.
- Never mention anything from a DM in public, or another member's situation.
- Vary the opening and structure between members; never send identical text.

## Structures

### cancel_intent / no_time
ES: Hola {nombre}! Leí tu comentario sobre {su frase}. Te entiendo, {mes ocupado/ritmo}. Antes de que decidas nada: ¿qué sería lo mínimo que te haría sentir que avanzas esta semana? {si hay oferta: "Si te sirve, puedo {oferta de config}."} Te leo.
EN: Hi {name}! I saw your comment about {their words}. Totally get it. Before you decide anything: what's the smallest thing that would make this week feel like progress? {offer if configured}. I'm here.

### value_doubt
ES: {nombre}, gracias por decirlo tal cual en tu post sobre {tema}. Me importa que esto te funcione. ¿Qué resultado esperabas tener a estas alturas? Con eso te digo exactamente qué parte del programa atacar primero.
EN: {name}, thanks for saying it straight in your post about {topic}. I want this to work for you. What result did you expect by now? Tell me and I'll point you to the exact part to focus on.

### overwhelm
ES: Hola {nombre}! Vi que no sabes por dónde empezar — es normal, hay mucho contenido. Olvida todo lo demás y haz solo esto: {primer paso de config.programSteps}. ¿Te parece si me cuentas cuando lo tengas?
EN: Hi {name}! Saw you're not sure where to start — very normal, there's a lot here. Ignore everything else and just do this: {first step}. Want to tell me when it's done?

### tech_blocked / access_blocked
ES: {nombre}, vi que te trabaste con {problema}. ¿Lo pudiste resolver? Si no, mándame una captura del error y lo vemos hoy.
EN: {name}, I saw you got stuck with {problem}. Did you sort it out? If not, send me a screenshot of the error and we'll fix it today.
(If the fix is in the knowledge base, include it instead of asking.)

### ignored
ES: {nombre}, tu pregunta sobre {tema} se nos pasó y lo siento. {respuesta corta del FAQ o "Te respondo ahora mismo en el post"}. ¿Te sirvió?
EN: {name}, your question about {topic} slipped through — sorry about that. {short answer or "I just replied on your post"}. Did that help?
(Prefer answering publicly with myskool-answer-desk; the DM is for HIGH-tier members.)

### went_quiet
ES: Hola {nombre}! Me acordé de tu post sobre {su último tema}. ¿Cómo vas con eso? Si te ayuda, {primer paso o próxima llamada en vivo de config}.
EN: Hey {name}! Your post about {their last topic} came to mind. How's that going? If useful, {next step or next live call}.

### refund_request / billing_issue / conflict → NEEDS CREATOR
Draft only a holding message and ask the creator what to do:
ES: Hola {nombre}, vi tu mensaje. Lo reviso personalmente y te escribo hoy.
EN: Hi {name}, I saw your message. I'm looking into it personally and will get back to you today.
