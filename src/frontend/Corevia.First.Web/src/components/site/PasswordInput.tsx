import { useState, type ComponentPropsWithoutRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInputCls } from "./AuthShell";

type PasswordInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

export function PasswordInput({
  className,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${authInputCls} pr-11 ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-gold"
        aria-label={visible ? hidePasswordLabel : showPasswordLabel}
      >
        {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}
