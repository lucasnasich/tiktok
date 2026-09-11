import { useState } from "react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PlanningAccountType, PlanningPlatform } from "@/content/planning-accounts";
import {
  createPlanningStudioAccount,
  normalizeSocialHandle,
  type PlanningStudioAccount,
} from "@/content/planning-studio-accounts";

const PLATFORM_OPTIONS: {
  id: PlanningPlatform;
  label: string;
}[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
];

type PlanningAccountFormProps = {
  initial?: PlanningStudioAccount;
  embedded?: boolean;
  onSave: (account: PlanningStudioAccount) => void;
  onCancel: () => void;
};

export function PlanningAccountForm({
  initial,
  embedded = false,
  onSave,
  onCancel,
}: PlanningAccountFormProps) {
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [accountType, setAccountType] = useState<PlanningAccountType>(
    initial?.type ?? "official",
  );
  const [platform, setPlatform] = useState<PlanningPlatform>(
    initial?.platform ?? "instagram",
  );
  const [handle, setHandle] = useState(initial?.handle ?? "");

  const handleSubmit = () => {
    const trimmedName = displayName.trim();
    const normalizedHandle = normalizeSocialHandle(handle);
    if (!trimmedName || !normalizedHandle) return;

    if (initial) {
      onSave({
        ...initial,
        displayName: trimmedName,
        type: accountType,
        platform,
        handle: normalizedHandle,
      });
      return;
    }

    onSave(
      createPlanningStudioAccount({
        displayName: trimmedName,
        type: accountType,
        platform,
        handle: normalizedHandle,
      }),
    );
  };

  const canSave =
    displayName.trim().length > 0 && normalizeSocialHandle(handle).length > 0;

  return (
    <div
      className={
        embedded
          ? "space-y-4"
          : "space-y-4 rounded-lg border border-border bg-card p-4"
      }
    >
      <div className="space-y-1.5">
        <label className="text-[12px] text-muted-foreground">
          Nombre de la cuenta
        </label>
        <Input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Ej. Mercantis"
          className="h-8 text-[13px]"
          autoFocus
        />
        <p className="text-[11px] text-muted-foreground">
          Una instancia por red. Creá Mercantis en Instagram y otra en TikTok si
          publicás en ambas.
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[12px] text-muted-foreground">Tipo</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "official" as const, label: "Oficial" },
              { id: "satellite" as const, label: "Satélite" },
            ] as const
          ).map((option) => (
            <Button
              key={option.id}
              type="button"
              size="sm"
              variant={accountType === option.id ? "default" : "outline"}
              onClick={() => setAccountType(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[12px] text-muted-foreground">Red</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((option) => (
            <Button
              key={option.id}
              type="button"
              size="sm"
              variant={platform === option.id ? "default" : "outline"}
              onClick={() => setPlatform(option.id)}
            >
              <PlatformIcon platform={option.id} className="size-3.5" />
              {option.label}
            </Button>
          ))}
        </div>
        <Input
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          placeholder={platform === "tiktok" ? "mercantis" : "mercantis.app"}
          className="h-8 text-[13px]"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={!canSave} onClick={handleSubmit}>
          {initial ? "Guardar cuenta" : "Crear cuenta"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
