# Nudge DMs — one first step, from their own goal

A nudge works when it feels like the creator remembered the person, not like
an automation noticed them. It points to one small step they can take today
and asks one easy question.

## Principles

- ≤ 70 words, plain text, the member's language, the creator's voice and
  sign-off (`config.voice`), first name.
- Hook = what they came for (join answer, intro, bio) or a resource that
  matches it — never their inactivity, level, course % or join date.
- One first step from `config.programSteps` / `config.links.startHere`
  matched to that goal. One link at most, only from config.
- One question they can answer in a line ("¿qué te frena?", "which one fits
  you better?").
- Vary the opening and structure; never send the same text twice.
- No "we noticed", no "you haven't", no guilt, no urgency.

## Structures

### not_started / never_returned — with a stated goal
ES: Hola {nombre}! Me quedé pensando en lo que querías lograr: {objetivo en sus palabras}. Si fuera yo, empezaría solo por esto: {primer paso}. Son {tiempo estimado si config lo dice} y te deja {resultado}. ¿Te animas esta semana?
EN: Hi {name}! I keep thinking about what you came here for: {goal in their words}. If I were you I'd start with just this: {first step}. It gets you {result}. Up for it this week?

### not_started — no goal known (member view or no answers)
ES: Hola {nombre}! ¿Cómo vas? 🙌 La mayoría arranca por {primer paso} — es lo que más rápido da resultados. ¿Qué te gustaría conseguir con la comunidad? Así te digo por dónde ir.
EN: Hi {name}! Most people start with {first step} — it's the quickest win here. What would you like to get out of the community? I'll point you to the right place.

### lurker — reads, never posts
ES: Hola {nombre}! Gracias por estar en la comunidad. Esta semana {un evento de list_events / config.events o un post real del feed relacionado con su objetivo} — creo que te puede servir para {objetivo}. Si tienes una pregunta, escríbemela por aquí y la vemos.
EN: Hi {name}! Thanks for being part of the community. This week {an event from list_events / config or a real post that matches their goal} — I think it could help with {goal}. Any question, send it my way.

- "Un post real" comes from this run's feed (title + link). None and no event
  → use the first-step structure instead. Never invent an event or a post.
- Don't invite lurkers to "introduce yourself publicly" — some lurk on
  purpose; a private question is lower pressure.
