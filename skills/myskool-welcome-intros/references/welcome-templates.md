# Welcome templates and matching heuristics

## Structure of a welcome comment

1. **Greeting with name** — varied opening.
2. **Mirror** — one specific detail from their intro (their business, city,
   goal, a funny line). Proves a human read it.
3. **One first step** — `config.programSteps[0]` or `config.links.startHere`,
   with its link. Exactly one.
4. **Connection** — 2–3 members with a reason each ("también…", "also…").
5. **Question** — easy to answer, about them, keeps the thread alive.

≤ 90 words, plain text. Put the parts in different orders across drafts.

## Openings (rotate; never repeat within one run)

ES: "¡Bienvenida/o, {nombre}!" · "{nombre}, qué bueno tenerte aquí." · "Hola {nombre}, te leí con atención." · "¡{nombre}! Llegaste al lugar indicado." · "Qué alegría verte por aquí, {nombre}." · "{nombre}, bienvenida/o a la comunidad 🙌"
EN: "Welcome, {name}!" · "{name}, so glad you're here." · "Hi {name}, loved reading this." · "{name}! You're in the right place." · "Great to have you, {name}." · "Welcome aboard, {name} 🙌"

Use the gender the member used for themselves; if unclear, use a neutral form
("te damos la bienvenida", "qué bueno tenerte").

## First-step lines

ES: "Tu primer paso: {paso} ({link})." · "Empieza solo por esto: {paso} → {link}" · "Si haces una sola cosa esta semana, que sea {paso}: {link}" · "Arranca aquí: {link} ({paso}), lo demás viene después."
EN: "Your first step: {step} ({link})." · "Start with just this: {step} → {link}" · "If you do one thing this week, make it {step}: {link}" · "Begin here: {link} ({step}); everything else can wait."

## Connection lines

ES: "{A} también está {motivo}, y {B} {motivo} — vale la pena que se conozcan." · "Te presento a {A} ({motivo}) y a {B} ({motivo})." · "Mira lo que compartió {A} sobre {tema}: van por el mismo camino." · "{A} y {B} empezaron igual que tú hace unas semanas."
EN: "{A} is also {reason}, and {B} {reason} — you should meet." · "Meet {A} ({reason}) and {B} ({reason})." · "Check what {A} shared about {topic}; you're on the same path." · "{A} and {B} started right where you are a few weeks ago."

Write members as "Full Name (@handle)" the first time.

## Closing questions

ES: "¿Qué es lo primero que te gustaría resolver?" · "¿Cuál es tu meta para este mes?" · "¿Ya tienes {herramienta} instalada o arrancamos desde cero?" · "¿Qué te hizo unirte justo ahora?"
EN: "What's the first thing you'd like to solve?" · "What's your goal for this month?" · "Do you already have {tool} set up, or are we starting from zero?" · "What made you join now?"

## Matching heuristics

Score each candidate in the 30-day pool (non-team, not the newcomer, wrote in
the last 30 days):

| Evidence in the candidate's posts/comments | Points |
|---|---|
| Same niche or industry (dental clinic, coaching, e-commerce…) | 3 |
| Same concrete goal (first client, automate WhatsApp, launch a course) | 3 |
| Same stage (beginner, already selling, agency) | 2 |
| Same tool or stack mentioned | 1 |
| Same city/country or language, if the newcomer mentioned it | 1 |
| Candidate shared a `win` related to the newcomer's goal | +1 |
| Candidate is a frequent helpful commenter | +1 |

Pick the top 2–3 with ≥ 3 points, at most one "helper" whose only match is
being helpful. Keep the evidence URL per match for the report. Never match on
health, religion, politics, age, family or finances.

## Welcome DM (optional)

≤ 60 words, adds something new: the next live call (from `list_events`; never invented), a direct question, or an
offer to help with the first step. Never repeat the public comment, never
duplicate Skool's Auto-DM, never pitch upsells.

ES: "Hola {nombre}! Te respondí en tu presentación 🙂 Una cosa más: {próxima llamada en vivo / recurso}. Si te trabas con {primer paso}, escríbeme por aquí."
EN: "Hi {name}! I replied to your intro 🙂 One more thing: {next live call / resource}. If you get stuck on {first step}, just message me here."

## "No intro yet" DM (needs members:read + DM opt-in)

For members who joined in the window but didn't post an intro. ≤ 60 words, no
pressure to post publicly, no "I saw you haven't introduced yourself". If
their join answer states a goal, use it as the hook — without saying where you
read it.

ES: "Hola {nombre}, ¡bienvenido/a a {comunidad}! Me alegra que estés aquí. Para arrancar, lo único que te recomiendo es {primer paso}. ¿Qué te gustaría lograr en tu primer mes? Así te digo por dónde ir."
EN: "Hi {name}, welcome to {community}! Glad you're here. To get started, the one thing I'd do is {first step}. What would you like to achieve in your first month? I'll point you the right way."

## Anti-patterns

- Same opening or structure in two drafts of the same run.
- Listing every module, more than one link per comment (besides the matches).
- "Let me know if you have any questions!" as the closing — ask something
  specific instead.
- Compliments that could apply to anyone ("great intro!").
