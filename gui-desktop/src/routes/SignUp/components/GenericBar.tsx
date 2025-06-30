import type { ReactNode } from "react";

export default function GenericBar({ color, onClick, children }: {
  color: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode
}) {
  return (
    <div onClick={onClick} className={`w-full h-full rounded-2xl flex flex-col justify-center
items-center ${color}`}>
      {children}
    </div>
  )
}
