# Save scripts — one structure per lane

A save message is a note from the creator to one person, not a dunning email
or a retention campaign. It works when it is short, specific to them, easy to
answer in one line, and leaves them free to go.

## Principles

- ≤ 80 words, plain text, the member's language, the creator's voice and
  sign-off (`config.voice`), first name.
- Personal hook from what they came for or did: their join answer, the module
  they were on, their post — **without** saying how you know ("me acordé de que
  querías conseguir tu primer cliente", never "vi en tus respuestas" or "vi que
  vas en el 20 %").
- One question. At most one offer, only from config. Never invent discounts,
  free months, refunds, deadlines or prices.
- No guilt, no countdowns, no "we noticed", no "churn", no tracking data.
- Vary opening and structure between members; never identical text.

## Lane 1 · payment_failed

The card failed; most people don't know yet. Help, don't chase.

ES: Hola {nombre}! Te escribo porque parece que el último pago de la comunidad no pasó (suele ser una tarjeta vencida). Para que no pierdas el acceso: {billingUpdateHowTo}. Si fue a propósito, también está bien, solo dime. 🙌
EN: Hi {name}! Quick heads-up: it looks like your last community payment didn't go through (usually an expired card). To keep your access: {billingUpdateHowTo}. If it was on purpose, no problem, just let me know.

No `billingUpdateHowTo` in config → `NEEDS CREATOR`: "How do members update
their card in your Skool? (I won't guess.)"

## Lane 2 · cancelled (still inside until `churnsAt`)

They decided. Thank them, learn why, one offer, let them go well.

ES: Hola {nombre}, vi que cancelaste — gracias por estos {meses} meses en la comunidad. Sigues teniendo acceso hasta el {churnsAt}. ¿Me cuentas qué fue lo que no te funcionó? Me ayuda mucho. {si hay oferta: "Si el tema es {motivo probable}, puedo {oferta de saveOffers}."}
EN: Hi {name}, I saw you cancelled — thanks for these {months} months with us. You keep access until {churnsAt}. Could you tell me what didn't work for you? It really helps. {offer if configured}

- Months = from `joinedAt`; drop the phrase if under one month.
- If they wrote why (churn-signals history, a DM) answer that reason instead of
  asking it again.
- Angry or refund → `NEEDS CREATOR`, holding message only:
  ES: Hola {nombre}, vi tu mensaje. Lo reviso personalmente y te escribo hoy.

## Lane 3 · trial_ending

Before the first charge: did they get the value? One concrete next step.

ES: Hola {nombre}! ¿Cómo vas con {lo que vino a buscar}? Si todavía no arrancaste, lo que más le sirve a la gente en la primera semana es {primer paso de config.programSteps o links.startHere}. {si hay trialOffer: "{trialOffer}"} ¿Te ayudo con algo antes de que termine tu prueba?
EN: Hi {name}! How's {what they came for} going? If you haven't started yet, what helps most in week one is {first step}. {trialOffer if configured} Anything I can help with before your trial ends?

Never say "your trial ends in 2 days, you'll be charged" as pressure; mention
the trial once, as context.

## Lane 4 · win_back

They left. A door, not a pitch.

DM (only when a thread exists; may fail):
ES: Hola {nombre}! Te extraño por la comunidad. Desde que te fuiste {una novedad real del feed, de list_events o de config.events, si la hay}. Si en algún momento quieres volver, aquí estás en casa {si hay winBackOffer: "— {winBackOffer}"}. ¿Qué te habría hecho quedarte?
EN: Hi {name}! We miss you around here. Since you left, {one real update from the feed, list_events or config.events}. If you ever want to come back, the door's open {winBackOffer if configured}. What would have made you stay?

Email draft (no thread, or the DM failed) — the creator sends it:
```
Subject (ES): {nombre}, una pregunta rápida
Body (ES):
Hola {nombre},
Soy {creador}, de {comunidad}. Vi que dejaste la comunidad hace unas semanas y quería preguntarte, sin rodeos: ¿qué te habría hecho quedarte?
Tu respuesta me ayuda a mejorarla. {winBackOffer si existe, con el link de config.links.join}
Gracias por el tiempo que estuviste.
{firma}

Subject (EN): {name}, one quick question
Body (EN): same structure.
```

- "Una novedad real" comes from this run's data (a new module announced in the
  feed, an event from `list_events` or config). None → drop the sentence; never invent one.
- The join link only from `config.links.join`.
