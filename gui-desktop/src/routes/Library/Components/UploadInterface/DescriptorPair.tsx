import type { ReactNode } from "react";

export default function DescriptorPair({
  label,
  component,
}: {
  label: string;
  component: ReactNode;
}) {
  return (
    <>
      <div className="w-1/5 h-full items-center flex flex-row">{label}</div>
      <div className="w-4/5 h-full flex flex-row items-center cursor-pointer">
        {component}
      </div>
    </>
  );
}
