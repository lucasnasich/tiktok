export function InspirationPostText({
  postText,
  author,
}: {
  postText: string;
  author?: string;
}) {
  return (
    <div className="space-y-1.5">
      {author ? (
        <p className="text-[12px] font-medium text-muted-foreground">{author}</p>
      ) : null}
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
        {postText}
      </p>
    </div>
  );
}
