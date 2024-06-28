import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead, useDisconnect } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { truncateAddress } from "../utils/truncateAddress";
import EmojiPicker from 'emoji-picker-react';
import { AiFillSmile } from "react-icons/ai"; // 引入一个表情图标 https://react-icons.github.io/react-icons/
import { AiOutlineUpload } from "react-icons/ai";
import { create as ipfsHttpClient } from "ipfs-http-client";
//import { create as ipfsHttpClient } from "ipfs-core"; //报错
//import fetch from 'node-fetch';


export default function UserStatus() {
    const address = useAddress();
    const disconnect = useDisconnect();
    const [newStatus, setNewStatus] = useState("");
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const characterDecoration = characterCount >= 1000 ? styles.characterCountOver : styles.characterCountUnder;

    const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

    const {
        data: myStatus,
        isLoading: isMyStatusLoading,
    } = useContractRead(contract, "getStatus", [address]);

    // const {
    //     data: efrogsNftName,
    //     isLoading: isEfrogsNftNameLoading,
    // } = useContractRead(contract, "efrogsNftName",[]);

    // const {
    //     data: croakName,
    //     isLoading: isCroakNameLoading,
    // } = useContractRead(contract, "croakName");

    const [chosenEmoji, setChosenEmoji] = useState('');
 
    const onEmojiClick = (emojiObject: {activeSkinTone: string, emoji: string, imageUrl: string, isCustom: boolean}) => {
        console.log("emojiObject===",emojiObject);
        //setChosenEmoji(emojiObject);
        // let message = msgValue;
        // message += emojiObject.emoji;
        // setNewStatus(message); // 以上写法内容显示有问题
        setNewStatus((prevMsg)=> prevMsg + emojiObject.emoji)
        setCharacterCount(newStatus.length)
    };

    const [isEmojiOpen, setIsEmojiOpen] = useState(false);

    //const [files, setFiles] = useState([])
    //const projectId = "e8fd8225189e4a45a6bdc17cafa65a3b";
    //const projectSecret = "rCJQkA1dynP6u5yyXz4xBbkwUCou6fDOPRmOe0q/nGLfJ8zCp/U0Cg";
    //const auth = "Basic " + btoa(projectId + ":" + projectSecret);
    //const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    //const auth = 'Basic ' + Buffer.from(":" +projectSecret).toString('base64');
    //const auth = "Bearer " + btoa(":" + projectSecret);

    // let ipfs = ipfsHttpClient({
    //     url: "https://linea-mainnet.infura.io/v3/e8fd8225189e4a45a6bdc17cafa65a3b",
    //     headers:{
    //       authorization: auth,
    //     }
    //   })

    // const ipfs = ipfsHttpClient({
    //     host: 'linea-mainnet.infura.io',
    //     port: 80,
    //     path: 'api/v3',
    //     protocol: 'https',
    //     headers: {
    //         authorization: auth,
    //     },
    // });

    // let ipfs =  fetch("https://linea-mainnet.infura.io/v3/e8fd8225189e4a45a6bdc17cafa65a3b", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       jsonrpc: "2.0",
    //       method: "eth_blockNumber",
    //       params: [],
    //       id: 1
    //     })
    //   })
    //   .then(response =>
    //     response.json()
    //   )
    //   .then(data => {
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });

    
// const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     const form = event.target;
//     const upFiles = (form[0]).files;
 
//     if (!upFiles || upFiles.length === 0) {
//       return alert("No files selected");
//     }
 
//     const file = upFiles[0];
//     //console.log("ipfs===",ipfs);
//     // upload files
//     const result = await ipfs.add(file);
 
//     setFiles([
//       ...files,
//       {
//         cid: result.cid,
//         path: result.path,
//       },
//     ]);
 
//     form.reset();
//   };

    if (!address) {
        return (
            <div>
                <ConnectWallet
                    modalSize="compact"
                />
                <p>Please connect your wallet.</p>
            </div>
        );
    }

    return (
        <div className={styles.userContainer} style={{ maxWidth: "500px" }}>
            <div className={styles.statusHeader}>
                {/* 展示当前账户地址 */}
                <Link href={`/account/${address}`} style={{ color: "white" }}>
                    <p className={styles.connectedAddress}>{truncateAddress(address!)}</p>
                </Link>
                {/* 推出登陆按钮 */}
                <button
                    className={styles.logoutButton}
                    onClick={() => disconnect()}
                >Logout</button>
            </div>

            {/* 展示当前账户的状态 */}
            {!isMyStatusLoading && myStatus && (
                <div>
                    <p className={styles.statusText}>{myStatus}</p>
                </div>
            )}

            <button
                className={styles.updateButton}
                onClick={() => setIsStatusModalOpen(true)}
            >Send Message</button>

            {isStatusModalOpen && (
                <div className={styles.statusModalContainer}>
                    <div className={styles.statusModal}>
                        <div className={styles.statusModalHeader}>
                            <p> 🐸 New Message:</p>
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                            >Close</button>
                        </div>
                        <textarea
                            value={newStatus}
                            onChange={(e) => {
                                setNewStatus(e.target.value)
                                //console.log("e.target.value==",e.target.value)
                                setCharacterCount(e.target.value.length)
                            }}
                            placeholder="Enter your message"
                            required={true}
                        />
                        <div className={styles.characterCountContainer}>
                            <p className={characterDecoration}>{characterCount}/1000</p>
                        </div>
                        <div>
                            {/* {chosenEmoji ? (
                                <span>You chose: {chosenEmoji.emoji}</span>
                            ) : (
                                <span>No emoji Chosen</span>
                            )} */}
                            <EmojiPicker onEmojiClick={onEmojiClick} open={isEmojiOpen} />
                        </div>
                        {/* 一行显示 */}
                        <div style={{ whiteSpace: 'nowrap' }} className={styles.btnContainer}>
                        <button onClick={() => setIsEmojiOpen(current => !current)} 
                              style={{ backgroundColor: 'transparent', border: 'none', opacity: 0.5 }}>
                            <AiFillSmile size={25} color="#FFFFFF"/>
                        </button>
                        {/* {ipfs && (
                            <form onSubmit={onSubmitHandler}>
                                <input type="file" name="file"/>
                                <button type="submit" style={{ backgroundColor: 'transparent', border: 'none', opacity: 0.5 }}>
                                <AiOutlineUpload size={25} color="#FFFFFF"/>
                                </button>
                            </form> 
                        )} */}

                        <Web3Button
                            className={styles.statusModalButton}
                            contractAddress={STATUS_CONTRACT_ADDRESS}
                            action={(contract) => contract.call(
                                "setStatus",
                                [newStatus]
                            )}
                            isDisabled={characterCount === 0 || characterCount > 1000}
                            onSuccess={() => {
                                setIsStatusModalOpen(false);
                                setNewStatus("");
                            }}
                        >Send Message</Web3Button>                        
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
};