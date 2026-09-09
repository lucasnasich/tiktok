import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GALLERY_MODE, type GalleryModeId } from "@/lib/gallery";

export function GalleryModeFilter({
  value,
  onChange,
}: {
  value: GalleryModeId;
  onChange: (mode: GalleryModeId) => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as GalleryModeId)}
    >
      <TabsList className="h-8">
        <TabsTrigger
          value={GALLERY_MODE.creativos.id}
          className="px-2.5 text-xs"
        >
          {GALLERY_MODE.creativos.label}
        </TabsTrigger>
        <TabsTrigger
          value={GALLERY_MODE.inspiracion.id}
          className="px-2.5 text-xs"
        >
          {GALLERY_MODE.inspiracion.label}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
