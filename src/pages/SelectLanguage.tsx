import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
];

const SelectLanguage = () => {
  const navigate = useNavigate();

  const selectLanguage = (code: string) => {
    localStorage.setItem("sc_language", code);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Choose Your Language</h1>
      <p className="text-muted-foreground mb-8 text-center">Select the language you'd like to study in</p>
      <div className="grid gap-3 w-full max-w-xs">
        {languages.map(({ code, label, flag }) => (
          <Button
            key={code}
            variant="outline"
            className="h-14 text-base justify-start gap-3"
            onClick={() => selectLanguage(code)}
          >
            <span className="text-2xl">{flag}</span>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SelectLanguage;
