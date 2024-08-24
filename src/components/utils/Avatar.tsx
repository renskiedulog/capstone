import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AvatarProps = {
  name: string;
  className?: string;
  image?: string;
};
export default function AvatarHolder({ name, className, image }: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Avatar>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className={className}>{initials}</AvatarFallback>
    </Avatar>
  );
}
