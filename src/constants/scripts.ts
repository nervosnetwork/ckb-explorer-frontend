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
  {
    codeHashes: ['0xe4d4ecc6e5f9a059bf2f7a82cca292083aebc0c421566a52484fe2ec51a9fb0c'],
    txHashes: ['0x04632cc459459cf5c9d384b43dee3e36f542a464bdd4127be7d6618ac6f8d268-0'],
    tag: 'cheque',
    category: 'lock',
  },
  {
    codeHashes: ['0x24b04faf80ded836efc05247778eec4ec02548dab6e2012c0107374aa3f68b81'],
    txHashes: [
      '0xb4c76f34382f03f39e2e39dd8a4cca037394bb3d032bde6a285c52e5a5e35535-0',
      '0xd521f52a7f4f4f00a25f0f6924c439844574d77d228113077ee0c84dc60ad11d-0',
      '0xdb29e26b3553559140bffddbc8f04011207db8a5996cbaf5b521db98e9d11b17-0',
    ],
    tag: 'm-nft_issuer',
    category: 'type',
  },
  {
    codeHashes: ['0xd51e6eaf48124c601f41abe173f1da550b4cbca9c6a166781906a287abbb3d9a'],
    txHashes: [
      '0xc3b5ada764ed341d42f86aee3ec17d7ffdd6372155b41b95687a7957b359ab39-0',
      '0xd521f52a7f4f4f00a25f0f6924c439844574d77d228113077ee0c84dc60ad11d-1',
      '0xdb29e26b3553559140bffddbc8f04011207db8a5996cbaf5b521db98e9d11b17-1',
    ],
    tag: 'm-nft_class',
    category: 'type',
  },
  {
    codeHashes: ['0x2b24f0d644ccbdd77bbf86b27c8cca02efa0ad051e447c212636d9ee7acaaec9'],
    txHashes: [
      '0xaf35eb9ba88d0b159ba450cfcc9089796cc401bc4089a43de018c12f990909a5-0',
      '0xd521f52a7f4f4f00a25f0f6924c439844574d77d228113077ee0c84dc60ad11d-2',
      '0xdb29e26b3553559140bffddbc8f04011207db8a5996cbaf5b521db98e9d11b17-2',
    ],
    tag: 'm-nft',
    category: 'type',
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
  {
    codeHashes: ['0x60d5f39efce409c587cb9ea359cefdead650ca128f0bd9cb3855348f98c70d5b'],
    txHashes: ['0x7f96858be0a9d584b4a9ea190e0420835156a6010a5fde15ffcdc9d9c721ccab-0'],
    tag: 'cheque',
    category: 'lock',
  },
  {
    codeHashes: ['0xb59879b6ea6fff985223117fa499ce84f8cfb028c4ffdfdf5d3ec19e905a11ed'],
    txHashes: [
      '0x744d2c4c4e6fabe66cfb08cb818532c50fffc682a7614746328c5d691a811c06-0',
      '0xbd262c87a84c08ea3bc141700cf55c1a285009de0e22c247a8d9597b4fc491e6-0',
      '0x194a0f84de41d006a07ece07c96a8130100818599fcf0b2ecf49e512b873ed6e-0',
    ],
    tag: 'm-nft_issuer',
    category: 'type',
  },
  {
    codeHashes: ['0x095b8c0b4e51a45f953acd1fcd1e39489f2675b4bc94e7af27bb38958790e3fc'],
    txHashes: [
      '0x4f27e40b302bcb3bf0af3deae460f46076de2b4db30c0212b14b341c20fcb330-0',
      '0xbd262c87a84c08ea3bc141700cf55c1a285009de0e22c247a8d9597b4fc491e6-1',
      '0x194a0f84de41d006a07ece07c96a8130100818599fcf0b2ecf49e512b873ed6e-1',
    ],
    tag: 'm-nft_class',
    category: 'type',
  },
  {
    codeHashes: ['0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f'],
    txHashes: [
      '0x7f9e3c1a2fc90411eb90fc2363101f6bd7b33875c3535117db5e52cd8a78b313-0',
      '0xbd262c87a84c08ea3bc141700cf55c1a285009de0e22c247a8d9597b4fc491e6-2',
      '0x194a0f84de41d006a07ece07c96a8130100818599fcf0b2ecf49e512b873ed6e-2',
    ],
    tag: 'm-nft',
    category: 'type',
  },
]
