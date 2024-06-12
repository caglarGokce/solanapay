import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as base58 from "base-58";

type GetData = {
  label: string
  icon: string
}
type PostData = {
  transaction: string,
  message?: string
}

async function handler(
    request: NextApiRequest,
    response: NextApiResponse<GetData|PostData>
  ) {
    if(request.method == "GET"){
      console.log("received GET request");
      return get(request, response);
    } else if(request.method == "POST"){
      console.log("received POST request");
      return await post(request, response);
    }
  }

function get(
  req: NextApiRequest,
  res: NextApiResponse<GetData>
  ) {
  const label = 'Commentin Deneme';
  const icon = 'https://x.com/commentin_com/header_photo';

  res.status(200).send({
      label,
      icon,
  });
}


const post = async (
    request: NextApiRequest,
    response: NextApiResponse<GetData|PostData>
  )  => {


    const sender = new PublicKey("5xTxsWqAhPUPAhocXGSngDVSUawPn29JiW8VkVGx4wYH");
    const receiver = new PublicKey("5xTxsWqAhPUPAhocXGSngDVSUawPn29JiW8VkVGx4wYH");
    const amount = LAMPORTS_PER_SOL*0.1;

    const TransferIx = await createTransferIx(sender,receiver,amount)

    // create the transaction
    const transaction = new VersionedTransaction(
        new TransactionMessage({
            payerKey: sender,
            recentBlockhash: '11111111111111111111111111111111',
            // add the instruction to the transaction
            instructions: [TransferIx]
        }).compileToV0Message()
    )

    const serializedTransaction = transaction.serialize()

    const base64Transaction = Buffer.from(serializedTransaction).toString('base64');
    const message = 'deneme islemi';

    response.status(200).send({ transaction: base64Transaction, message });
};



  async function createTransferIx(sender:PublicKey, receiver:PublicKey, amount:number) {

    
    const TransferIx = SystemProgram.transfer({
        fromPubkey:sender,
        toPubkey:receiver,
        lamports:amount*LAMPORTS_PER_SOL
    }
    );


    return TransferIx;
}
