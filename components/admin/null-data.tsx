const NullData = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-[50dvh] flex items-center justify-center text-xl md:text-2xl">
      <p className="font-medium">{title}</p>
    </div>
  );
};

export default NullData;
