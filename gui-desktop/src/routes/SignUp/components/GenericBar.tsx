import type { FormEvent, ReactNode } from "react";

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

export function DefaultContenteditableSpan({ defaultText, onInput }: { defaultText: string, onInput: (text: string) => void }) {
  return (
    <span contentEditable={true} onClick={(e) => {
      if (e.currentTarget.textContent?.trim() === defaultText) {
        e.currentTarget.textContent = ""
      }
    }}
      onBlur={(e) => {
        e.currentTarget.textContent?.trim() || (() => {
          e.currentTarget.textContent = defaultText
        })();
      }}
      onInput={(e: FormEvent<HTMLSpanElement>) => {
        e.preventDefault()
        onInput(e.currentTarget.textContent || "")
      }} suppressContentEditableWarning > {defaultText}

    </span >
  )
}
