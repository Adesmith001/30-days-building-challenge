import HomeForm from "../components/HomeForm";
import SetupShell from "../components/SetupShell";

import type {
  HomeOption,
} from "../types/comparison";

export default function HomeScreen({
  home,
  onChange,
  onNext,
}: {
  home: HomeOption;

  onChange:
    (home: HomeOption) => void;

  onNext: () => void;
}) {
  const isA =
    home.id === "a";

  return (
    <SetupShell
      step={
        isA
          ? "02 / 03"
          : "03 / 03"
      }
      eyebrow={
        isA
          ? "HOME A"
          : "HOME B"
      }
      title={
        isA
          ? "THE CLOSER OPTION."
          : "THE FARTHER OPTION."
      }
      description="Use estimates you trust. The simulator only knows what you enter, and precise addresses are never required."
    >
      <HomeForm
        home={home}
        subtitle={
          isA
            ? "Closer / more expensive"
            : "Farther / cheaper"
        }
        buttonLabel={
          isA
            ? "ADD HOME B →"
            : "COMPARE →"
        }
        onChange={onChange}
        onNext={onNext}
      />
    </SetupShell>
  );
}