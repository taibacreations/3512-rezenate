const Founders = () => {
  return (
    <section className="pb-[8vh]">
      <div>
        <div className="max-w-[878px] mx-auto text-center">
          <h2 className="font-readex font-light text-[60px] leading-[113%] tracking-[-0.04em] capitalize text-black">
            THE{" "}
            <span className="text-[#9564F4] tracking-[0em] italic font-tartuffo lowercase">
              founders
            </span>
          </h2>
          <p className="font-outfit text-[24px] leading-[130%] text-black mt-[1.5vh]">
            Rezenate is founder-led. We believe that leadership can be both
            strong and kind.
          </p>
        </div>

        <div className="flex justify-center items-center gap-8 mt-[3vh]">
          <div className="bg-[url(/founder.webp)] bg-cover bg-center w-[566px] h-[685px] flex flex-col items-center text-center">
            <img
              src="/founder-1.webp"
              alt="founder"
              className="w-[177px] h-[177px] rounded-full mt-[7.8vh]"
            />
            <div className="max-w-[394px] mx-auto">
              <h3 className="font-readex font-normal text-[32px] leading-[90%] text-black mt-[3vh]">
                Zak — The Alchemist
              </h3>
              <h4 className="font-outfit text-[24px] leading-[115%] text-black mt-[4vh] max-w-[350px]">
                “Leadership begins with honesty and not hierarchy.”
              </h4>
              <hr className="text-[#9564F4] mt-[2vh] border-[#9564F4] w-[70%] mx-auto" />
              <p className="font-outfit font-normal text-[24px] leading-[130%] text-black mt-[1.5vh]">
                Zak brings clarity to who companies are, what they stand for,
                and who should lead them next.
              </p>
            </div>
          </div>

          <div className="bg-[url(/founder.webp)] bg-cover bg-center w-[566px] h-[685px] flex flex-col items-center text-center">
            <img
              src="/founder-2.webp"
              alt="founder"
              className="w-[177px] h-[177px] rounded-full mt-[7.8vh]"
            />
            <div className="max-w-[447px] mx-auto">
              <h3 className="font-readex font-normal text-[32px] leading-[90%] text-black mt-[3vh]">
                Chloe — The Architect
              </h3>
              <h4 className="font-outfit text-[24px] leading-[115%] text-black mt-[4vh]">
                “We built Rezenate to make leadership feel human again.”
              </h4>
              <hr className="text-[#9564F4] mt-[2vh] border-[#9564F4] w-[70%] mx-auto" />
              <p className="font-outfit font-normal text-[24px] leading-[130%] text-black mt-[1.5vh]">
                Chloe brings structure, psychology, and emotional intelligence
                to every engagement, ensuring great partnerships are built to
                last.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founders;
