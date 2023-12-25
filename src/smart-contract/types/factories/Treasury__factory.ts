/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Treasury, TreasuryInterface } from "../Treasury";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "timeLockAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "releaseERC1155",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "releaseERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "releaseERC721",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "releaseNativeToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523461001a576040516113a161002082396113a190f35b600080fdfe60806040526004361015610018575b361561001657005b005b60003560e01c806301ffc9a7146100d8578063150b7a02146100d357806367eecad2146100ce578063715018a6146100c957806371707047146100c45780638da5cb5b146100bf578063bc197c81146100ba578063bd050743146100b5578063c4d66de8146100b0578063d0d9db72146100ab578063f23a6e61146100a65763f2fde38b0361000e57610660565b610641565b6105e1565b61055a565b61052d565b6104de565b610399565b610380565b610345565b610319565b6102a3565b61011f565b6001600160e01b031981165b036100f057565b600080fd5b90503590610102826100dd565b565b906020828203126100f057610118916100f5565b90565b9052565b346100f05761014c61013a610135366004610104565b610bc8565b60405191829182901515815260200190565b0390f35b6001600160a01b031690565b6001600160a01b0381166100e9565b905035906101028261015c565b806100e9565b9050359061010282610178565b634e487b7160e01b600052604160045260246000fd5b90601f01601f1916810190811067ffffffffffffffff8211176101c357604052565b61018b565b906101026101d560405190565b92836101a1565b67ffffffffffffffff81116101c357602090601f01601f19160190565b0190565b90826000939282370152565b9092919261021e610219826101dc565b6101c8565b938185526020850190828401116100f057610102926101fd565b9080601f830112156100f05781602061011893359101610209565b906080828203126100f057610268818361016b565b92610276826020850161016b565b92610284836040830161017e565b92606082013567ffffffffffffffff81116100f0576101189201610238565b346100f05761014c6102c26102b9366004610253565b92919091610bae565b604051918291826001600160e01b0319909116815260200190565b6080818303126100f0576102f1828261016b565b92610118610302846020850161016b565b93610310816040860161017e565b9360600161016b565b346100f05761033561032c3660046102dd565b92919091611105565b604051005b60009103126100f057565b346100f05761035536600461033a565b6103356106b0565b91906040838203126100f05761011890610377818561016b565b9360200161017e565b346100f05761033561039336600461035d565b90611263565b346100f0576103a936600461033a565b61014c6103be6033546001600160a01b031690565b604051918291826001600160a01b03909116815260200190565b67ffffffffffffffff81116101c35760208091020190565b90929192610400610219826103d8565b93818552602080860192028301928184116100f057915b8383106104245750505050565b60208091610432848661017e565b815201920191610417565b9080601f830112156100f057816020610118933591016103f0565b91909160a0818403126100f05761046f838261016b565b9261047d816020840161016b565b92604083013567ffffffffffffffff81116100f0578261049e91850161043d565b92606081013567ffffffffffffffff81116100f057836104bf91830161043d565b92608082013567ffffffffffffffff81116100f0576101189201610238565b346100f05761014c6102c26104f4366004610458565b93929092610c20565b90916060828403126100f057610118610516848461016b565b93610524816020860161017e565b9360400161016b565b346100f0576103356105403660046104fd565b91610cb1565b906020828203126100f0576101189161016b565b346100f05761014c61013a610570366004610546565b610ab6565b9160c0838303126100f05761058a828461016b565b92610598836020830161016b565b926105a6816040840161017e565b926105b4826060850161017e565b926105c2836080830161016b565b9260a082013567ffffffffffffffff81116100f0576101189201610238565b346100f0576103356105f4366004610575565b949390939291926111cb565b91909160a0818403126100f057610617838261016b565b92610625816020840161016b565b92610633826040850161017e565b926104bf836060830161017e565b346100f05761014c6102c2610657366004610600565b93929092610c05565b346100f057610335610673366004610546565b6107d1565b61068061070c565b61010261069e565b6101506101186101189290565b61011890610688565b6101026106ab6000610695565b610830565b610102610678565b156106bf57565b60405162461bcd60e51b815280610708600482016020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b0390fd5b6101026107216033546001600160a01b031690565b61073a61072d33610150565b916001600160a01b031690565b146106b8565b6101029061074c61070c565b6107ac565b1561075857565b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b610102906106ab6107c06101506000610695565b6001600160a01b0383161415610751565b61010290610740565b906001600160a01b03905b9181191691161790565b61011890610150906001600160a01b031682565b610118906107ef565b61011890610803565b9061082561011861082c9261080c565b82546107da565b9055565b6033546001600160a01b031690610848816033610815565b61087b6108757f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09361080c565b9161080c565b9161088560405190565b600090a3565b6101189060081c5b60ff1690565b610118905461088b565b61011890610893565b61011890546108a3565b6108936101186101189290565b156108ca57565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b9060ff906107e5565b6108936101186101189260ff1690565b9061094f61011861082c9261092f565b8254610926565b9061ff009060081b6107e5565b9061097361011861082c92151590565b8254610956565b61011b906108b6565b602081019291610102919061097a565b9190916109e26109aa6109a66000610899565b1590565b938480610a86575b8015610a41575b6109c2906108c3565b600192856109d96109d2866108b6565b600061093f565b610a3157610aa4565b926109ea5750565b6109f5600080610963565b610a2c7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249891610a2360405190565b91829182610983565b0390a1565b610a3c846000610963565b610aa4565b50610a566109a6610a513061080c565b610b72565b80156109b957506109c2610a6a60006108ac565b610a7e610a7760016108b6565b9160ff1690565b1490506109b9565b50610a9160006108ac565b610a9e610a7760016108b6565b106109b2565b50610ab1906106ab610b3e565b600190565b610118906000610993565b15610ac857565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b610b33610b2e6000610899565b610ac1565b610102610102610b5d565b610102610b21565b610b53610b2e6000610899565b6101028033610830565b610102610b46565b6101186101186101189290565b3b610b84610b806000610b65565b9190565b1190565b610ba1610b9b6101189263ffffffff1690565b60e01b90565b6001600160e01b03191690565b50505050610bba600090565b5061011863150b7a02610b88565b61011890630271189760e51b6001600160e01b0319821614908115610beb575090565b6001600160e01b0319166301ffc9a760e01b149050610118565b5050505050610c12600090565b5061011863f23a6e61610b88565b5050505050610c2d600090565b5061011863bc197c81610b88565b906101029291610c4961070c565b610c8b565b15610c5557565b60405162461bcd60e51b815260206004820152600e60248201526d125b9d985b1a5908185b5bdd5b9d60921b6044820152606490fd5b610cac61010293610ca7610c9f6000610b65565b855b11610c4e565b61080c565b610cd9565b906101029291610c3b565b6001600160a01b0390911681526040810192916101029160200152565b610d1c600492610d0d61010295610cf363a9059cbb610b88565b92610cfd60405190565b9687946020860190815201610cbc565b602082018103825203836101a1565b610df6565b90610d2e610219836101dc565b918252565b610d3d6020610d21565b7f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564602082015290565b610118610d33565b8015156100e9565b9050519061010282610d6e565b906020828203126100f05761011891610d76565b15610d9e57565b60405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608490fd5b90610e03610e129261080c565b90610e0c610d66565b91610e4a565b8051610e21610b806000610b65565b11610e295750565b610e45816020610e3a610102945190565b818301019101610d83565b610d97565b6101189291610e596000610b65565b91610ed9565b15610e6657565b60405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608490fd5b3d15610ed457610ec93d610d21565b903d6000602084013e565b606090565b90600061011894938192610eeb606090565b50610f02610ef83061080c565b8390311015610e5f565b60208101905191855af1610f14610eba565b91610f66565b15610f2157565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b91929015610f9857508151610f7e610b806000610b65565b14610f87575090565b610f9361011891610b72565b610f1a565b82611006565b60005b838110610fb15750506000910152565b8181015183820152602001610fa1565b610fe2610feb6020936101f993610fd6815190565b80835293849260200190565b95869101610f9e565b601f01601f191690565b602080825261011892910190610fc1565b9061100f825190565b61101c610b806000610b65565b111561102b5750805190602001fd5b6107089061103860405190565b62461bcd60e51b815291829160048301610ff5565b9061010293929161105c61070c565b611091565b6001600160a01b039182168152911660208201526060810192916101029160400152565b6040513d6000823e3d90fd5b9092610ca761109f9161080c565b6323b872dd813b156100f05760006110cc916110d782966110bf60405190565b9889978896879560e01b90565b855260048501611061565b03925af18015611100576110e85750565b6101029060006110f881836101a1565b81019061033a565b611085565b9061010293929161104d565b90610102959493929161112261070c565b61117e565b919361116a6101189694611163611171949761115360a088019960008901906001600160a01b03169052565b6001600160a01b03166020870152565b6040850152565b6060830152565b6080818403910152610fc1565b929193610ca76111909196929661080c565b9163f242432a833b156100f0576110d76111c0936000979388946111b360405190565b9a8b998a98899760e01b90565b875260048701611127565b906101029594939291611111565b90610102916111e661070c565b61122e565b156111f257565b60405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606490fd5b9061125e610102926112496112436000610b65565b84610ca1565b610ca76112553061080c565b849031116111eb565b61132b565b90610102916111d9565b1561127457565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606490fd5b156112c057565b60405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608490fd5b60006101029261134c8293610ca76113423061080c565b849031101561126d565b9061135660405190565b90818003925af1611365610eba565b506112b956fea2646970667358221220c84ff1fbba7f2f918e1de24de2bac2db0d9b67f18bebf82124bc17b882054f5d64736f6c63430008120033";

type TreasuryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TreasuryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Treasury__factory extends ContractFactory {
  constructor(...args: TreasuryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Treasury> {
    return super.deploy(overrides || {}) as Promise<Treasury>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Treasury {
    return super.attach(address) as Treasury;
  }
  override connect(signer: Signer): Treasury__factory {
    return super.connect(signer) as Treasury__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TreasuryInterface {
    return new utils.Interface(_abi) as TreasuryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Treasury {
    return new Contract(address, _abi, signerOrProvider) as Treasury;
  }
}