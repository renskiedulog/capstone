import { Avatar, AvatarFallback } from "../ui/avatar";

type AvatarProps = {
  name: string;
  className?: string;
};
export default function AvatarHolder({ name, className }: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Avatar>
      <AvatarFallback className={className}>{initials}</AvatarFallback>
    </Avatar>
  );
}
