import Image from "next/image";
import brid_home from "../image/brid_home.jpg"


export default function Home() {
  return (
    <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
      <div className="basis-full flex-col flex justify-center md:basis-2/3">
        <p>Project all thie Birds</p>
        <h1 className="pb-5">
          The world&apos;s <span className="special-word">Rarset</span><br /> Birds
        </h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has
        </p>

      </div>
      <div className="hidden md:block basis-1/3">
      <Image
          alt="homeImage"
          src={brid_home}
          sizes="100vw"
          className="w-full h-[500px]"
        />
        
      </div>
    </div>
  );
}
