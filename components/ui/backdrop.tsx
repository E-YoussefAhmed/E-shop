const Backdrop = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="z-20 bg-slate-200 opacity-50 w-dvw h-dvh fixed top-0 left-0"
    />
  );
};

export default Backdrop;
