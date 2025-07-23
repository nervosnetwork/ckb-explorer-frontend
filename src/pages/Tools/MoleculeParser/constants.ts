import { mol, BytesLike } from '@ckb-ccc/core'

export type CodecMap = Record<string, mol.CodecLike<any>>

function enhanceCodecWithHumanize(codec: mol.CodecLike<any>) {
  return {
    ...codec,
    decode: (data: BytesLike) => {
      const result = codec.decode(data)
      // Convert bigints to strings for better display
      if (typeof result === 'bigint') {
        return result.toString()
      }
      return result
    },
  }
}

/**
 * built-in re-writable codecs
 */
export const builtinCodecs: CodecMap = {
  Uint8: enhanceCodecWithHumanize(mol.Uint8),
  Uint16: enhanceCodecWithHumanize(mol.Uint16),
  Uint32: enhanceCodecWithHumanize(mol.Uint32),
  Uint64: enhanceCodecWithHumanize(mol.Uint64),
  Uint128: enhanceCodecWithHumanize(mol.Uint128),
  Uint256: enhanceCodecWithHumanize(mol.Uint256),
  Uint512: enhanceCodecWithHumanize(mol.Uint512),
  Bytes: mol.Bytes,
  Byte32: mol.Byte32,
  BytesVec: mol.BytesVec,
  Byte32Vec: mol.Byte32Vec,
  BytesOpt: mol.BytesOpt,
  Bool: mol.Bool,
  String: mol.String,
}

/**
 * merge user tokens with primitive tokens
 * @param userCodecs
 */
export const mergeBuiltinCodecs = (userCodecs: CodecMap): CodecMap => {
  return { ...userCodecs, ...builtinCodecs }
}

/**
 * primitive schemas
 */
export const blockchainSchema: string = `
option ScriptOpt (Script);

array ProposalShortId [byte; 10];

vector UncleBlockVec <UncleBlock>;
vector TransactionVec <Transaction>;
vector ProposalShortIdVec <ProposalShortId>;
vector CellDepVec <CellDep>;
vector CellInputVec <CellInput>;
vector CellOutputVec <CellOutput>;

table Script {
    code_hash:      Byte32,
    hash_type:      HashType,
    args:           Bytes,
}

struct OutPoint {
    tx_hash:        Byte32,
    index:          Uint32,
}

struct CellInput {
    since:           Uint64,
    previous_output: OutPoint,
}

table CellOutput {
    capacity:       Uint64,
    lock:           Script,
    type_:          ScriptOpt,
}

struct CellDep {
    out_point:      OutPoint,
    dep_type:       DepType,
}

table RawTransaction {
    version:        Uint32,
    cell_deps:      CellDepVec,
    header_deps:    Byte32Vec,
    inputs:         CellInputVec,
    outputs:        CellOutputVec,
    outputs_data:   BytesVec,
}

table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}

struct RawHeader {
    version:                Uint32,
    compact_target:         Uint32,
    timestamp:              Uint64,
    number:                 Uint64,
    epoch:                  Uint64,
    parent_hash:            Byte32,
    transactions_root:      Byte32,
    proposals_hash:         Byte32,
    extra_hash:             Byte32,
    dao:                    Byte32,
}

struct Header {
    raw:                    RawHeader,
    nonce:                  Uint128,
}

table UncleBlock {
    header:                 Header,
    proposals:              ProposalShortIdVec,
}

table Block {
    header:                 Header,
    uncles:                 UncleBlockVec,
    transactions:           TransactionVec,
    proposals:              ProposalShortIdVec,
}

table BlockV1 {
    header:                 Header,
    uncles:                 UncleBlockVec,
    transactions:           TransactionVec,
    proposals:              ProposalShortIdVec,
    extension:              Bytes,
}

table CellbaseWitness {
    lock:    Script,
    message: Bytes,
}

table WitnessArgs {
    lock:                   BytesOpt,          // Lock args
    input_type:             BytesOpt,          // Type args for input
    output_type:            BytesOpt,          // Type args for output
}
`
