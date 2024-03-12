import { IconType } from "react-icons";

const Status = ({
  text,
  bg,
  color,
  icon: Icon,
}: {
  text: string;
  icon: IconType;
  bg: string;
  color: string;
}) => {
  return (
    <div className={`${bg} ${color} px-1 rounded flex items-center gap-1`}>
      {text} <Icon size={15} />
    </div>
  );
};

export default Status;
