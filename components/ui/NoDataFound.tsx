import { LucideProps } from "lucide-react";
import React from "react";

interface Props {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
}

const NoDataFound = ({ Icon, description, title }: Props) => {
  return (
    <div className="text-center py-12">
      <div className="text-zinc-400 mb-4">
        <Icon size={48} className="mx-auto mb-2" />
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default NoDataFound;
