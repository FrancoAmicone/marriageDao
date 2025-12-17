/**
 * Purpose: Contract addresses and configurations for Marriage DAO
 * Contains deployed contract addresses on Worldchain Mainnet
 */

// Contract Addresses on Worldchain Mainnet (Chain ID: 480)
export const CONTRACT_ADDRESSES = {
  HUMAN_BOND: '0xB3cbCB0294995FE1aCD7187B94aEDBD4555c5A63' as const,
  VOW_NFT: '0x8c64c304854F9284ddb976918dF37Bd4f5949F22' as const,
  MILESTONE_NFT: '0x566c4a366625F08A714dd092f8bD2F0E86f906f5' as const,
  TIME_TOKEN: '0x39e629681a9db65D9352961d8dCD4C96C4A1169a' as const,
} as const

// World App Configuration
export const WORLD_APP_CONFIG = {
  APP_ID: 'app_bfc3261816aeadc589f9c6f80a98f5df' as `app_${string}`,
  ACTIONS: {
    PROPOSE_BOND: 'propose-bond',
    ACCEPT_BOND: 'accept-bond',
  },
} as const

// VowNFT ABI
export const VOW_NFT_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "_onlyHumanBond",
    "inputs": [],
    "outputs": [],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproved",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTokenMetadata",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "partnerA",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "partnerB",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "bondStart",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "marriageId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTokensByMarriage",
    "inputs": [
      {
        "name": "marriageId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[2]",
        "internalType": "uint256[2]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "humanBondContract",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "imageCID",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "marriageToToken",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mintVowNFT",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_partnerA",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_partnerB",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_bondStart",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_marriageId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setHumanBondContract",
    "inputs": [
      {
        "name": "contractAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setImageCID",
    "inputs": [
      {
        "name": "newCid",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenMetadata",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "partnerA",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "partnerB",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "bondStart",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "marriageId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VowMinted",
    "inputs": [
      {
        "name": "marriageId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ERC721IncorrectOwner",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InsufficientApproval",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721NonexistentToken",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "StringsInsufficientHexLength",
    "inputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "VowNFT__TransfersDisabled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "VowNFT__UnauthorizedMinter",
    "inputs": []
  }
] as const

// MilestoneNFT ABI
export const MILESTONE_NFT_ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "approve", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "balanceOf", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "freezeMilestones", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "frozen", "inputs": [], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "getApproved", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "humanBondContract", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "isApprovedForAll", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "operator", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "latestYear", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "milestoneURIs", "inputs": [{ "name": "year", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "metadata", "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "mintMilestone", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "year", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "name", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "ownerOf", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "safeTransferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "safeTransferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }, { "name": "data", "type": "bytes", "internalType": "bytes" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "setApprovalForAll", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }, { "name": "approved", "type": "bool", "internalType": "bool" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "setHumanBondContract", "inputs": [{ "name": "contractAddress", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "setMilestoneURI", "inputs": [{ "name": "year", "type": "uint256", "internalType": "uint256" }, { "name": "uri", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "supportsInterface", "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "tokenURI", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "tokenYear", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "transferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "event", "name": "Approval", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "approved", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false },
  { "type": "event", "name": "ApprovalForAll", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "operator", "type": "address", "indexed": true, "internalType": "address" }, { "name": "approved", "type": "bool", "indexed": false, "internalType": "bool" }], "anonymous": false },
  { "type": "event", "name": "MilestoneMinted", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "year", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "tokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
  { "type": "event", "name": "MilestoneURISet", "inputs": [{ "name": "year", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "uri", "type": "string", "indexed": false, "internalType": "string" }], "anonymous": false },
  { "type": "event", "name": "MilestonesFrozen", "inputs": [], "anonymous": false },
  { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
  { "type": "event", "name": "Transfer", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false },
  { "type": "error", "name": "ERC721IncorrectOwner", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }, { "name": "owner", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC721InsufficientApproval", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }] },
  { "type": "error", "name": "ERC721InvalidApprover", "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC721InvalidOperator", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC721InvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC721InvalidReceiver", "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC721InvalidSender", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC721NonexistentToken", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }] },
  { "type": "error", "name": "MilestoneNFT__Frozen", "inputs": [] },
  { "type": "error", "name": "MilestoneNFT__NotAuthorized", "inputs": [] },
  { "type": "error", "name": "MilestoneNFT__TransfersDisabled", "inputs": [] },
  { "type": "error", "name": "MilestoneNFT__URI_NotFound", "inputs": [{ "name": "year", "type": "uint256", "internalType": "uint256" }] },
  { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }
] as const

// HumanBond ABI
export const HUMAN_BOND_ABI = [
  { "type": "constructor", "inputs": [{ "name": "_worldId", "type": "address", "internalType": "address" }, { "name": "_VowNFT", "type": "address", "internalType": "address" }, { "name": "_TimeToken", "type": "address", "internalType": "address" }, { "name": "_milestoneNFT", "type": "address", "internalType": "address" }, { "name": "_appId", "type": "string", "internalType": "string" }, { "name": "_actionPropose", "type": "string", "internalType": "string" }, { "name": "_actionAccept", "type": "string", "internalType": "string" }, { "name": "_day", "type": "uint256", "internalType": "uint256" }, { "name": "_year", "type": "uint256", "internalType": "uint256" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "DAY", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "GROUP_ID", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "YEAR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "_getMarriageId", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }], "stateMutability": "pure" },
  { "type": "function", "name": "accept", "inputs": [{ "name": "proposer", "type": "address", "internalType": "address" }, { "name": "root", "type": "uint256", "internalType": "uint256" }, { "name": "acceptorNullifier", "type": "uint256", "internalType": "uint256" }, { "name": "proof", "type": "uint256[8]", "internalType": "uint256[8]" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "activeMarriageOf", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }], "stateMutability": "view" },
  { "type": "function", "name": "cancelProposal", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "claimYield", "inputs": [{ "name": "partner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "divorce", "inputs": [{ "name": "partner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "externalNullifierAccept", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "externalNullifierPropose", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "getBondStart", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "getCurrentMilestoneYear", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "getIncomingProposals", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "tuple[]", "internalType": "struct HumanBond.Proposal[]", "components": [{ "name": "proposer", "type": "address", "internalType": "address" }, { "name": "proposed", "type": "address", "internalType": "address" }, { "name": "proposerNullifier", "type": "uint256", "internalType": "uint256" }, { "name": "accepted", "type": "bool", "internalType": "bool" }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" },
  { "type": "function", "name": "getMarriage", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct HumanBond.Marriage", "components": [{ "name": "partnerA", "type": "address", "internalType": "address" }, { "name": "partnerB", "type": "address", "internalType": "address" }, { "name": "nullifierA", "type": "uint256", "internalType": "uint256" }, { "name": "nullifierB", "type": "uint256", "internalType": "uint256" }, { "name": "bondStart", "type": "uint256", "internalType": "uint256" }, { "name": "lastClaim", "type": "uint256", "internalType": "uint256" }, { "name": "lastMilestoneYear", "type": "uint256", "internalType": "uint256" }, { "name": "active", "type": "bool", "internalType": "bool" }] }], "stateMutability": "view" },
  { "type": "function", "name": "getMarriageId", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }], "stateMutability": "pure" },
  { "type": "function", "name": "getMarriageView", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "v", "type": "tuple", "internalType": "struct HumanBond.MarriageView", "components": [{ "name": "partnerA", "type": "address", "internalType": "address" }, { "name": "partnerB", "type": "address", "internalType": "address" }, { "name": "nullifierA", "type": "uint256", "internalType": "uint256" }, { "name": "nullifierB", "type": "uint256", "internalType": "uint256" }, { "name": "bondStart", "type": "uint256", "internalType": "uint256" }, { "name": "lastClaim", "type": "uint256", "internalType": "uint256" }, { "name": "lastMilestoneYear", "type": "uint256", "internalType": "uint256" }, { "name": "active", "type": "bool", "internalType": "bool" }, { "name": "pendingYield", "type": "uint256", "internalType": "uint256" }, { "name": "marriageId", "type": "bytes32", "internalType": "bytes32" }] }], "stateMutability": "view" },
  { "type": "function", "name": "getPendingYield", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "getProposal", "inputs": [{ "name": "proposer", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct HumanBond.Proposal", "components": [{ "name": "proposer", "type": "address", "internalType": "address" }, { "name": "proposed", "type": "address", "internalType": "address" }, { "name": "proposerNullifier", "type": "uint256", "internalType": "uint256" }, { "name": "accepted", "type": "bool", "internalType": "bool" }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" },
  { "type": "function", "name": "getUserDashboard", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "d", "type": "tuple", "internalType": "struct HumanBond.UserDashboard", "components": [{ "name": "isMarried", "type": "bool", "internalType": "bool" }, { "name": "partner", "type": "address", "internalType": "address" }, { "name": "pendingYield", "type": "uint256", "internalType": "uint256" }, { "name": "timeBalance", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" },
  { "type": "function", "name": "hasPendingProposal", "inputs": [{ "name": "proposer", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "isMarried", "inputs": [{ "name": "a", "type": "address", "internalType": "address" }, { "name": "b", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "manualCheckAndMint", "inputs": [{ "name": "partner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "marriageIds", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }], "stateMutability": "view" },
  { "type": "function", "name": "marriages", "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }], "outputs": [{ "name": "partnerA", "type": "address", "internalType": "address" }, { "name": "partnerB", "type": "address", "internalType": "address" }, { "name": "nullifierA", "type": "uint256", "internalType": "uint256" }, { "name": "nullifierB", "type": "uint256", "internalType": "uint256" }, { "name": "bondStart", "type": "uint256", "internalType": "uint256" }, { "name": "lastClaim", "type": "uint256", "internalType": "uint256" }, { "name": "lastMilestoneYear", "type": "uint256", "internalType": "uint256" }, { "name": "active", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "milestoneNFT", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract MilestoneNFT" }], "stateMutability": "view" },
  { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "proposals", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "proposer", "type": "address", "internalType": "address" }, { "name": "proposed", "type": "address", "internalType": "address" }, { "name": "proposerNullifier", "type": "uint256", "internalType": "uint256" }, { "name": "accepted", "type": "bool", "internalType": "bool" }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "proposalsFor", "inputs": [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "propose", "inputs": [{ "name": "proposed", "type": "address", "internalType": "address" }, { "name": "root", "type": "uint256", "internalType": "uint256" }, { "name": "proposerNullifier", "type": "uint256", "internalType": "uint256" }, { "name": "proof", "type": "uint256[8]", "internalType": "uint256[8]" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "proposerIndex", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "timeToken", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract TimeToken" }], "stateMutability": "view" },
  { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "usedNullifier", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }, { "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "vowNFT", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract VowNFT" }], "stateMutability": "view" },
  { "type": "function", "name": "worldId", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract IWorldID" }], "stateMutability": "view" },
  { "type": "event", "name": "AnniversaryAchieved", "inputs": [{ "name": "partnerA", "type": "address", "indexed": true, "internalType": "address" }, { "name": "partnerB", "type": "address", "indexed": true, "internalType": "address" }, { "name": "year", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
  { "type": "event", "name": "MarriageDissolved", "inputs": [{ "name": "partnerA", "type": "address", "indexed": true, "internalType": "address" }, { "name": "partnerB", "type": "address", "indexed": true, "internalType": "address" }, { "name": "timestamp", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
  { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
  { "type": "event", "name": "ProposalAccepted", "inputs": [{ "name": "partnerA", "type": "address", "indexed": true, "internalType": "address" }, { "name": "partnerB", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
  { "type": "event", "name": "ProposalCancelled", "inputs": [{ "name": "proposer", "type": "address", "indexed": true, "internalType": "address" }, { "name": "proposed", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
  { "type": "event", "name": "ProposalCreated", "inputs": [{ "name": "proposer", "type": "address", "indexed": true, "internalType": "address" }, { "name": "proposed", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
  { "type": "event", "name": "YieldClaimed", "inputs": [{ "name": "partnerA", "type": "address", "indexed": true, "internalType": "address" }, { "name": "partnerB", "type": "address", "indexed": true, "internalType": "address" }, { "name": "rewardEach", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
  { "type": "error", "name": "HumanBond__AlreadyAccepted", "inputs": [] },
  { "type": "error", "name": "HumanBond__CannotProposeToSelf", "inputs": [] },
  { "type": "error", "name": "HumanBond__InvalidAddress", "inputs": [] },
  { "type": "error", "name": "HumanBond__InvalidNullifier", "inputs": [] },
  { "type": "error", "name": "HumanBond__NoActiveMarriage", "inputs": [] },
  { "type": "error", "name": "HumanBond__NotProposedToYou", "inputs": [] },
  { "type": "error", "name": "HumanBond__NotYourMarriage", "inputs": [] },
  { "type": "error", "name": "HumanBond__NothingToClaim", "inputs": [] },
  { "type": "error", "name": "HumanBond__ProposalAlreadyExists", "inputs": [] },
  { "type": "error", "name": "HumanBond__UserAlreadyMarried", "inputs": [] },
  { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }
] as const

// TimeToken ABI
export const TIME_TOKEN_ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "allowance", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "spender", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "approve", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "balanceOf", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "burn", "inputs": [{ "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "burnFrom", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "decimals", "inputs": [], "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }], "stateMutability": "view" },
  { "type": "function", "name": "humanBondContract", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "mint", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "name", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "setHumanBondContract", "inputs": [{ "name": "_hb", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "transfer", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "transferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "event", "name": "Approval", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "spender", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
  { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false },
  { "type": "event", "name": "Transfer", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
  { "type": "error", "name": "ERC20InsufficientAllowance", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, { "name": "allowance", "type": "uint256", "internalType": "uint256" }, { "name": "needed", "type": "uint256", "internalType": "uint256" }] },
  { "type": "error", "name": "ERC20InsufficientBalance", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, { "name": "balance", "type": "uint256", "internalType": "uint256" }, { "name": "needed", "type": "uint256", "internalType": "uint256" }] },
  { "type": "error", "name": "ERC20InvalidApprover", "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC20InvalidReceiver", "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC20InvalidSender", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "ERC20InvalidSpender", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "NotAuthorized", "inputs": [] },
  { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] },
  { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }
] as const
