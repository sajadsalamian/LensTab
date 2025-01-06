import { SetStateAction, useEffect, useState } from "react";
import Main, { HeadMeta } from "../../components/Layouts/Main/Main";
import Button from "../../components/Elements/Button";
import { Toast } from "../../components/Layouts/Main/Helper";
import Input from "../../components/Elements/Input";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import ticketBg from "../../assets/images/ticket.png";
import profileBottom from "../../assets/images/profile-bottom.png";
import { ConnectKitButton } from "connectkit";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { signMessage, switchChain } from "@wagmi/core";
import { config } from "../../main";
import { zksyncSepoliaTestnet } from "wagmi/chains";
import { parseEther } from "viem";
import Label from "../../components/Elements/Label";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Profile() {
  const account = useAccount();

  const {
    data: hash,
    error,
    isPending,
    writeContractAsync,
  } = useWriteContract({ config });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const [user, setUser]: any = useState({});
  const [loadUser, setLoadUser] = useState(false);

  const [tokenCount, setTokenCount] = useState(1);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    FetchUser();
  }, []);

  useEffect(() => {
    if (user.user_id != null) {
      setLoadUser(true);
      // console.log(user);
      if (account.status === "connected") {
        ConnectWallet();
      }
    }
  }, [user]);

  useEffect(() => {
    if (account.status === "connected") {
      ConnectWallet();
    } else if (account.status === "disconnected") {
      DisconnectWallet();
    }
  }, [account.status]);

  const FetchUser = () => {
    let userInfo1 = JSON.parse(localStorage.getItem("user"));
    let postData = {
      user_id: "" + userInfo1.user_id,
      user_name: userInfo1.user_name,
    };
    axios({
      method: "post",
      url: import.meta.env.VITE_API_URL + "/user",
      data: postData,
    })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch((err) => {
        if (err.response) {
          console.log("Fetch user Data Error Response:", err.response);
        }
      });
  };

  const ConnectWallet = async () => {
    if (
      account.status === "connected" &&
      loadUser &&
      (user.wallet_address == null || user.wallet_address.length < 5)
    ) {
      // console.log("connect wallet");
      let postData = { user_id: user.user_id, wallet_address: account.address };
      axios
        .post(import.meta.env.VITE_API_URL + "/submit_wallet", postData)
        .then((res) => {
          console.log(res.data[0]);
          if (!res.data[0].error) {
            setUser({ ...user, wallet_address: account.address });
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, wallet_address: account.address })
            );
          } else {
            Toast("e", res.data[0].message);
          }
        })
        .catch((err) => {
          console.log("Fetch user Data Error:", err);
        });
    } else {
      // console.log("not new connect wallet");
    }
  };

  const SignWallet = async () => {
    const chainId = account.chainId;
    if (chainId != Number(import.meta.env.VITE_CHAIN_ID)) {
      switchChain(config, { chainId: Number(import.meta.env.VITE_CHAIN_ID) });
    }

    if (user.sign != null && user.sign.length > 10) {
      return;
    }
    try {
      const signature = await signMessage(config, {
        message: "Hello From Lens Tab!",
      });

      let postData = { user_id: user.user_id, sign: signature };
      axios
        .post(import.meta.env.VITE_API_URL + "/submit_sign", postData)
        .then((res) => {
          console.log(res.data[0]);
          if (!res.data[0].error) {
            setUser({ ...user, sign: signature });
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, sign: signature })
            );
          } else {
            Toast("e", res.data[0].message);
          }
        })
        .catch((err) => {
          console.log("Fetch user Data Error:", err);
        });
    } catch (error: any) {
      console.log("Failed to send transaction:", error);
      let message = "error on Sign";
      switch (error.code) {
        case 4001:
          message = "Sign canceled by user.";
          break;
      }
      Toast("error", message);
    }
  };

  const DisconnectWallet = () => {
    if (
      account.status === "disconnected" &&
      user.wallet_address != null &&
      user.wallet_address.length > 5
    ) {
      console.log("disconnect wallet");
      let postData = { user_id: user.user_id, wallet_address: "" };
      axios
        .post(import.meta.env.VITE_API_URL + "/submit_wallet", postData)
        .then((res) => {
          console.log(res.data[0]);
          if (!res.data[0].error) {
            setUser({ ...user, wallet_address: "" });
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, wallet_address: "" })
            );
          } else {
            Toast("e", res.data[0].message);
          }
        })
        .catch((err) => {
          console.log("Fetch user Data Error:", err);
        });
      let postData1 = { user_id: user.user_id, sign: "" };
      axios
        .post(import.meta.env.VITE_API_URL + "/submit_sign", postData1)
        .then((res) => {
          console.log(res.data[0]);
          if (!res.data[0].error) {
            setUser({ ...user, sign: null });
            localStorage.setItem(
              "user",
              JSON.stringify({ ...user, sign: null })
            );
          } else {
            Toast("e", res.data[0].message);
          }
        })
        .catch((err) => {
          console.log("Fetch user Data Error:", err);
        });
    } else {
      console.log("not new disconnect wallet");
    }
  };

  useEffect(() => {
    console.log("isConfirmed", isConfirmed);
    if (isConfirmed) {
      AddTokensToPRofile();
    }
    return () => {};
  }, [isConfirmed]);

  const BuyToken = async () => {
    if (tokenCount < 1) {
      Toast("w", "Please enter number more than 0");
      return;
    }
    if (user.sign == null) {
      SignWallet();
      return;
    }
    try {
      await switchChain(config, {
        // chainId: zksyncSepoliaTestnet.id,
        chainId: +import.meta.env.VITE_CHAIN_ID,
      });

      const abi = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "buyGameToken",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "deployer",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];

      // lenz : 0x7D2E00dDFA500a2A4b4DD5f75cC65B2ff7D29255
      // zksync : 0x67A4058Bf46d5b51232ff5aa45dc93Ea6445a51E
      // adccount 2 : 0xaa8A194030c92f3cBbbB9A13C7ca1466ED0b573D

      const txHash = await writeContractAsync({
        address: "0x7D2E00dDFA500a2A4b4DD5f75cC65B2ff7D29255", //lenz
        // address: "0x67A4058Bf46d5b51232ff5aa45dc93Ea6445a51E", //zksync
        abi,
        chainId: +import.meta.env.VITE_CHAIN_ID,
        // chainId: zksyncSepoliaTestnet.id,
        functionName: "buyGameToken",
        value: parseEther("" + tokenCount * 0.0001),
      });
      console.log("txhash result", txHash);
      setTxHash(txHash);
    } catch (error: any) {
      console.log("Failed to send transaction:", error.message);
      console.log(error.message.split(".")[0]);
      let message = "error on transaction";
      switch (error.message.split(".")[0]) {
        case "User rejected the request":
          message = "Transaction canceled.";
          break;
      }
      Toast("error", message);
    }
  };

  const AddTokensToPRofile = () => {
    let postData = {
      user_id: user.user_id,
      token_amount: Number(tokenCount),
      hash: txHash,
    };
    axios
      .post(import.meta.env.VITE_API_URL + "/buy_token", postData)
      .then((res) => {
        // console.log(res.data[0]);
        if (!res.data[0].error) {
        } else {
          Toast("e", res.data[0].message);
        }
      })
      .catch((err) => {
        console.log("Fetch user Data Error:", err);
      });
    Toast("success", "Ticket Added to Your Profile.");
    FetchUser();
  };

  const ConnectButtonClick = (show: any) => {
    return () => {
      show();
    };
  };

  return (
    <Main title="Profile">
      <HeadMeta title="Profile" />
      <div className="mb-5 pt-5">
        <div className="w-52 mx-auto">
          <div className="text-center flex flex-col items-center bg-white p-2 border-8 border-black rounded-tl-2xl rounded-tr-2xl">
            <div className="mb-2 bg-primary w-36 text-3xl rounded-lg py-3 px-2">
              {user.user_name}
            </div>
            <div className="grid grid-cols-2 w-36 gap-x-2">
              <div
                className=" text-black py-3 w-full text-center text-2xl"
                style={{
                  backgroundImage: `url(${ticketBg})`,
                  backgroundSize: "100% 100%",
                }}
              >
                <div>TICKET</div>
                <div>{user?.total_token}</div>
              </div>
              <div className="bg-primary text-black py-3 rounded w-full text-center text-2xl">
                <div>SCORE</div>
                <div>{user?.score}</div>
              </div>
            </div>
          </div>
          <img src={profileBottom} alt="" />
        </div>
      </div>
      <div className="p-2  text-center  overflow-hidden mb-20">
        {account.isConnected ? (
          <>
            {loadUser && (
              <div className="w-full mx-auto flex items-center justify-center">
                {user.sign != null && user.sign.length > 10 ? (
                  <>
                    <div className="flex gap-x-4 mb-6">
                      <div>
                        <Label label="Number of Tokens" className="text-2xl" />
                        <div className="flex bg-white rounded-md">
                          <div
                            className="flex justify-center items-center px-2 cursor-pointer"
                            onClick={() =>
                              tokenCount > 1 && setTokenCount(tokenCount - 1)
                            }
                          >
                            <Icon
                              icon="typcn:minus"
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                          <Input
                            onChange={(e: {
                              target: { value: SetStateAction<number> };
                            }) => setTokenCount(e.target.value)}
                            type="number"
                            error={undefined}
                            label=""
                            value={tokenCount}
                            onBlur={undefined}
                            className="w-20 text-center"
                          />
                          <div
                            className="flex justify-center items-center px-2 cursor-pointer"
                            onClick={() => setTokenCount(tokenCount + 1)}
                          >
                            <Icon
                              icon="mingcute:plus-fill"
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                        </div>
                      </div>

                      {!isPending && !isConfirming ? (
                        <Button
                          label="Buy Tokens"
                          onClick={BuyToken}
                          className="items-end !py-0 h-[50px] mt-[31px]"
                          disabled={isPending}
                        />
                      ) : (
                        <div className="flex justify-center items-center w-20">
                          <RotatingLines
                            visible={true}
                            width="24"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                            strokeColor="green"
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Button label="Sign" onClick={SignWallet} className="mb-5" />
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-white mb-2 uppercase">
            Please connect wallet to buy tokens.
          </p>
        )}
        {/* <div className="text-white mb-2 text-2xl">
          <p>Transaction Status</p>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
        </div> */}
        <div>
          <div className="flex justify-center">
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => {
                return (
                  <Button
                    onClick={ConnectButtonClick(show)}
                    label={
                      isConnected
                        ? ensName ?? truncatedAddress
                        : "Connect Wallet"
                    }
                  />
                );
              }}
            </ConnectKitButton.Custom>
          </div>
        </div>
      </div>
    </Main>
  );
}
