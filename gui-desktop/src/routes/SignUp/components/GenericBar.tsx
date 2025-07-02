import type { ReactNode } from "react";

export default function GenericBar({ color, onClick, children, override }: {
  color: string;
  override?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode
}) {
  return (
    <div onClick={onClick} className={`w-full h-full  flex flex-col justify-center
items-center ${override ? override : "rounded-2xl shadow-md shadow-black/30 border-indigo-ogg-0/50 border"} ${color}`}>
      {children}
    </div>
  )
}
