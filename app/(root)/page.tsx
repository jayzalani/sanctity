
import HomePageButton from "@/components/HomePageButton";
import ScrollingText from "@/components/ScrollingText";

export default function Home() {
  return (
    <div className="relative">
      <h1 className = "flex items-center m-4 p-5 text-[150px] font-jetbrains-semiBold font-extrabold" >
          COMMENTS!
      </h1 >
      <div className="w-full h-24  flex items-center m-10 p-10 text-[150px] font-jetbrains-semiBold font-extrabold rounded-4xl">
        <ScrollingText/>
        </div>
      <div className="flex flex-col items-center mt-10 text-center min-h-screen p-10 font-jetbrains-semiBold font-bold text-6xl sm:text-6xl md:text-6xl leading-tight tracking-tight">
        <span className="uppercase">Be Bold, Comment Loud!</span>
        <span className="mt-4 uppercase ">Let the World Hear</span>
        <span>Your Roar.</span>
        <div className =  "flex mt-20 ">
        <HomePageButton/>
      </div>
      
      
      </div>
     
      
      <div className="absolute -z-10 inset-0 h-full w-full 
        bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)] 
        bg-[size:100px_100px] 
        [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]" />

    </div>
  )
}
