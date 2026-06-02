import React, { useState ,useEffect} from "react";

const EmptyChat = ({ userId }) => {
    const gifs = [
    "https://i.pinimg.com/originals/78/5f/ce/785fce6734c7285c7ab99f871c732158.gif",
    "https://preview.redd.it/chat-gifs-v0-xy4lnnveoe3e1.gif?width=256&auto=webp&s=1af2dbdc9974068865e8bd49272ae8b4b71c6936",
    "https://assets-v2.lottiefiles.com/a/7628dc54-c511-11ee-895a-8f05989f2acd/dIjnOyZbMe.gif",
    "https://mir-s3-cdn-cf.behance.net/project_modules/hd/961ddf85291073.5d779f4cbfaec.gif",
    "https://pic.chinesefontdesign.com/uploads/2017/10/chinesefontdesign.com-2017-10-20_13-22-47_796842.gif",
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/a16d1f73880943.5cf79aac68565.gif",
    "https://images.gr-assets.com/hostedimages/1388771356ra/7925990.gif",
    "https://www.gifcen.com/wp-content/uploads/2022/08/coffee-gif.gif"
  ];

  const [gifIndex, setGifIndex] = useState(0);

 useEffect(() => {
  setGifIndex((prev) => {
    let next;

    do {
      next = Math.floor(Math.random() * gifs.length);
    } while (next === prev && gifs.length > 1);
    console.log("GIF INDEX:", next);
    return next;
  });
}, [userId]);
  return (
    <div className="flex items-center justify-center h-full w-full scale-75">
      <div
        className="
          text-center
          animate-fadeIn
          backdrop-blur-xs
          bg-[#1f1f1fc2]
          p-6
          rounded-2xl
        "
      >
      
        {/* TITLE */}
        <h2 className="text-white text-xl font-bold mt-5">
          No Messages Yet
        </h2>

        {/* SUBTEXT */}
        <p className="text-zinc-400 text-[0.9vw] mt-2 w-[80%] mx-auto">
          Start chatting and make the first move 🚀
        </p>
          {/* GIF */}
        <img
          src={gifs[gifIndex]}
          alt="No Messages"
          className="w-48 md:w-60 mx-auto  h-[70%] w-[70%] "
        />
      </div>
    </div>
  );
};

export default EmptyChat;