import type {
  DuckRequest,
} from "../schemas/ai";

const goals: Record<
  DuckRequest["action"],
  string
> = {
  start: `
Ask the single best first question.

Usually clarify the uncertain part,
the desired outcome,
or the decisive constraint.

Return kind="question".
`,

  answer: `
Use the user's latest answer
to narrow the problem.

Ask exactly one next question unless
a small real-world test would be
more useful.

Return kind="question".
`,

  hint: `
Do not advance to a new question.

Give the requested progressive hint
for the current question.

Return kind="hint"
and keep question null.
`,

  explain: `
Stop withholding the answer.

Give a direct, concise explanation
in Markdown grounded in the current thread.

Return kind="explanation".
`,

  resolve: `
Evaluate the user's proposed answer
against the thread.

Return kind="resolution".

If one important dependency remains,
use status="almost" or "needs-evidence"
and provide exactly one remainingQuestion.

If resolved,
provide a concise conclusion
and a 4-8 node reasoningMap.
`,
};

export function buildPrompt(
  input: DuckRequest,
) {
  const payload = {
    problem: input.problem,

    currentState:
      input.state,

    currentQuestion:
      input.currentQuestion,

    latestUserText:
      input.userText,

    requestedHintLevel:
      input.hintLevel,
  };

  return `
TASK

${goals[input.action]}

ACTION

${input.action}

SESSION DATA

<user_data>

${JSON.stringify(
  payload,
  null,
  2,
)}

</user_data>

Remember:

Ask only one question when the action
requires a question.

Keep the interaction concise and neutral.
`;
}