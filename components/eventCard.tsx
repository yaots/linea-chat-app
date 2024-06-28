import Link from "next/link";
import styles from "../styles/Home.module.css";
import { truncateAddress } from "../utils/truncateAddress";
import { BigNumber } from "ethers";
import { AiFillCloseCircle } from "react-icons/ai";
import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead, useDisconnect } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
// import ReactTooltip from 'react-tooltip';

type EventCardProps = {
    walletAddress: string;
    newStatus: string;
    timeStamp: BigNumber;
};

export default function EventCard(props: EventCardProps) {
    // 将 BigNumber 类型的时间戳转换为 JavaScript 的 Date 对象
    const date = new Date(props.timeStamp.toNumber() * 1000);
    const address = useAddress();
    const { contract } = useContract(STATUS_CONTRACT_ADDRESS);
    const getStatus = useContractRead(contract, "getStatus", [address]);
    // const delMessage = (address) => {
    //     if(window.confirm('Are you sure to delete message?')) 
    //         {
    //             console.log("delMessage===",address);
    //         }
    //     };

    return (
        <div className={styles.eventCard}>
            <div className={styles.eventHeader}>
                {/* 设置账户地址的链接 */}
                <Link href={`account/${props.walletAddress}`} style={{ color: "white" }}>
                    {/* 通过截取地址，以便更友好地展示 */}
                    <p className={styles.connectedAddress}>{truncateAddress(props.walletAddress)}</p>
                </Link>
                <p style={{ fontSize: "0.75rem" }}>{date.toLocaleString()}</p>
                <p>
                    <Web3Button
                        style={{ backgroundColor: 'transparent', border: 'none', opacity: 0.5,height: '1px' }}
                        contractAddress={STATUS_CONTRACT_ADDRESS}
                        action={(contract) => contract.call(
                            "delStatus",
                            [props.walletAddress]
                        )}
                        onSuccess={() => {
                            getStatus;
                        }}>
                            <AiFillCloseCircle size={25} color="#FFFFFF"/>
                    </Web3Button>                      
                        {/* <button onClick={() => delMessage(props.walletAddress)} 
                              data-tip="Delete message" data-for="delMessageButton"
                              style={{ backgroundColor: 'transparent', border: 'none', opacity: 0.5 }}>
                            <AiFillCloseCircle size={25} color="#FFFFFF"/>
                        </button> */}
                        {/* <ReactTooltip/> */}
                </p>
            </div>
            <p style={{ fontSize: "16px"}}>{props.newStatus}</p>
        </div>
    );
};