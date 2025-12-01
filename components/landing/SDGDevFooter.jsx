import Image from "next/image";
import { georama } from "../../lib/fonts";
import ccIcon from "../../src/assets/icons/cc.svg";

const SdgDevFooter = () => {
    return (
        <footer className="py-4 bg-black text-center border-t border-white/10">
            <div className="flex justify-center items-center gap-2">
                <Image
                    src={ccIcon}
                    alt="Creative Commons Icon"
                    width={20}
                    height={20}
                />
                <p className={`${georama.className} text-[14px] text-orange-400`}>
                    2025 CommUnity. All rights reserved.
                </p>

            </div>
        </footer>
    );
};

export default SdgDevFooter;
