import { LucideProps } from "lucide-react";
import React from "react";

interface Props {
  title: string;
  description: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

const PageHeader = ({ Icon, description, title }: Props) => {
  return (
    <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-8 h-8 text-orange-400" />
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        <p className="text-zinc-200 text-lg max-w-2xl mb-6">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;
