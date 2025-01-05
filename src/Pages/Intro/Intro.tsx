import splash from "../../assets/images/start-banner.png";
import Button from "../../components/Elements/Button";

export default function Intro() {
  return (
    <div className="w-screen h-screen overflow-y-auto bg-primary relative">
      <div className="flex flex-col justify-center items-center pb-10 h-full">
        {/* <div className="grow flex flex-col justify-center items-center"> */}
        <img src={splash} alt="" className="w-full h-full" />
        {/* </div> */}
        <div className="w-full grow-0 px-4 absolute bottom-4 left-0 right-0">
          <p className="text-white text-center px-2 text-2xl mb-5">
            Players purchase tokens to join the game. Campaigns start every
            Saturday at 12:00 UTC, and at the end of each cycle, the total token
            revenue is distributed: 1st rank gets 50%, 2nd rank gets 30%, and
            3rd rank gets 20%. Compete, rank up, and earn rewards!
          </p>
          <Button
            label="Start"
            className="w-full text-center block"
            link="/index"
            variant="dark"
            type="l"
          />
        </div>
      </div>
    </div>
  );
}
