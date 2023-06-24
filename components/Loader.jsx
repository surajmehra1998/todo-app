import React from "react";
import Image from "next/image";
const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <Image src="/loader.svg" alt="Loader" height={100} width={100} />
    </div>
  );
};

export default Loader;
