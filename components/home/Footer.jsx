import Image from "next/image";
import { georama } from "../../lib/fonts";
import ccIcon from "../../src/assets/icons/cc.svg";

const Footer = () => {
  return (
    <footer className="py-6 bg-black text-center">
      <div className="inline-flex justify-center items-center gap-2">
        <Image
          src={ccIcon}
          alt="Creative Commons Icon"
          width={24}   // ⬅ Bigger size
          height={24}  // ⬅ Bigger size
          className="relative top-[1px]" // ⬅ Adjust to align perfectly
        />

        <p
          className={`${georama.className} text-[16px] align-middle`} // ⬅ Align text baseline
          style={{ color: "#FB8B28" }}
        >
          2025 Community. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
