export interface ContractHashTag {
  codeHashes: string[] // The code hashes whose hash type are type in mainnet and testnet are different
  txHashes: string[] //  mainnet and testnet contract tx hashes
  tag: string
  category: 'lock' | 'type'
}

export const MainnetContractHashTags: ContractHashTag[] = [
  {
    codeHashes: ['0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'],
    txHashes: ['0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c-0'],
    tag: 'secp256k1_blake160',
    category: 'lock',
  },
  {
    codeHashes: ['0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8'],
    txHashes: ['0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c-1'],
    tag: 'secp256k1 / multisig / locktime',
    category: 'lock',
  },
  {
    codeHashes: ['0x0fb343953ee78c9986b091defb6252154e0bb51044fd2879fde5b27314506111'],
    txHashes: ['0xa05f28c9b867f8c5682039c10d8e864cf661685252aa74a008d255c33813bb81-0'],
    tag: 'secp256k1 / anyone-can-pay (deprecated)',
    category: 'lock',
  },
  {
    codeHashes: ['0xd369597ff47f29fbc0d47d2e3775370d1250b85140c670e4718af712983a2354'],
    txHashes: ['0x4153a2014952d7cac45f285ce9a7c5c0c0e1b21f2d378b82ac1433cb11c25c4d-0'],
    tag: 'secp256k1 / anyone-can-pay',
    category: 'lock',
  },
  {
    codeHashes: ['0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e'],
    txHashes: ['0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c-2'],
    tag: 'nervos dao',
    category: 'type',
  },
  {
    codeHashes: ['0x5e7a36a77e68eecc013dfa2fe6a23f3b6c344b04005808694ae6dd45eea4cfd5'],
    txHashes: ['0xc7813f6a415144643970c2e88e0bb6ca6a8edc5dd7c1022746f628284a9936d5-0'],
    tag: 'sudt',
    category: 'type',
  },
  {
    codeHashes: ['0xbf43c3602455798c1a61a596e0d95278864c552fafe231c063b3fabf97a8febc'],
    txHashes: ['0x1d60cb8f4666e039f418ea94730b1a8c5aa0bf2f7781474406387462924d15d4-0'],
    tag: 'pwlock-k1-acpl',
    category: 'lock',
  },
]

export const TestnetContractHashTags: ContractHashTag[] = [
  {
    codeHashes: ['0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'],
    txHashes: ['0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37-0'],
    tag: 'secp256k1_blake160',
    category: 'lock',
  },
  {
    codeHashes: ['0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8'],
    txHashes: ['0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37-1'],
    tag: 'secp256k1 / multisig / locktime',
    category: 'lock',
  },
  {
    codeHashes: ['0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b'],
    txHashes: ['0x4f32b3e39bd1b6350d326fdfafdfe05e5221865c3098ae323096f0bfc69e0a8c-0'],
    tag: 'secp256k1 / anyone-can-pay (deprecated)',
    category: 'lock',
  },
  {
    codeHashes: ['0x3419a1c09eb2567f6552ee7a8ecffd64155cffe0f1796e6e61ec088d740c1356'],
    txHashes: ['0xec26b0f85ed839ece5f11c4c4e837ec359f5adc4420410f6453b1f6b60fb96a6-0'],
    tag: 'secp256k1 / anyone-can-pay',
    category: 'lock',
  },
  {
    codeHashes: ['0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e'],
    txHashes: ['0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f-2'],
    tag: 'nervos dao',
    category: 'type',
  },
  {
    codeHashes: [
      '0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212',
      '0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4',
    ],
    txHashes: [
      '0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958-0',
      '0xe12877ebd2c3c364dc46c5c992bcfaf4fee33fa13eebdf82c591fc9825aab769-0',
    ],
    tag: 'sudt',
    category: 'type',
  },
  {
    codeHashes: ['0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63'],
    txHashes: ['0x4f254814b972421789fafef49d4fee94116863138f72ab1e6392daf3decfaec1-0'],
    tag: 'pwlock-k1-acpl',
    category: 'lock',
  },
  {
    codeHashes: ['0x6843c5fe3acb7f4dc2230392813cb9c12dbced5597fca30a52f13aa519de8d33'],
    txHashes: ['0x28ee75f9745828eaade301ef24d0b037404717469a299180ecb679259cb688ab-0'],
    tag: 'pwlock-r1',
    category: 'lock',
  },
]
