import Image from "next/image";

const Icon = ({ styles, name, imgUrl, isActive, handleClick }) => {
  return (
    <div
      className={`w-[48px] h-[48px] rounded-[10px] ${
        isActive && isActive === name && "bg-base-300"
      } flex justify-center items-center cursor-pointer hover:bg-base-300 transition-colors ${styles}`}
      onClick={handleClick}
    >
      {!isActive ? (
        <Image src={imgUrl} alt="aside_icons" className="w-1/2 h-1/2" />
      ) : (
        <Image
          src={imgUrl}
          alt="aside_icons"
          className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
        />
      )}
    </div>
  );
};

export default Icon;
