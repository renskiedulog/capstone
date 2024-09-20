import { HTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  image?: string;
}

export default function AvatarHolder({
  name,
  className,
  image,
  ...rest
}: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <Avatar className={className} {...rest}>
      <AvatarImage src={image} alt={name} className="object-cover" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
