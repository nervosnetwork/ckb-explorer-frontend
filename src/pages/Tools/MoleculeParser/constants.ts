/* eslint-disable import/no-extraneous-dependencies */
import type { CodecMap } from '@ckb-lumos/molecule'
import { BI, BIish } from '@ckb-lumos/bi'
import { number, AnyCodec } from '@ckb-lumos/codec'
import { blockchain } from '@ckb-lumos/base'

function enhanceUnpackBIish(codec: AnyCodec, afterUnpack: (arg: BIish) => string) {
  return {
    ...codec,
    unpack: (packed: Uint8Array) => afterUnpack(codec.unpack(packed)),
  }
}

const humanizeBigInteger = (x: BIish) => BI.from(x).toString()

/**
 * built-in re-writable codecs
 */
export const builtinCodecs: CodecMap = {
  Uint8: enhanceUnpackBIish(number.Uint8, humanizeBigInteger),
  Uint16: enhanceUnpackBIish(number.Uint16, humanizeBigInteger),
  Uint32: enhanceUnpackBIish(number.Uint32, humanizeBigInteger),
  Uint64: enhanceUnpackBIish(number.Uint64, humanizeBigInteger),
  Uint128: enhanceUnpackBIish(number.Uint128, humanizeBigInteger),
  Uint256: enhanceUnpackBIish(number.Uint256, humanizeBigInteger),
  Uint512: enhanceUnpackBIish(number.Uint512, humanizeBigInteger),
  Bytes: blockchain.Bytes,
  Byte32: blockchain.Byte32,
  BytesVec: blockchain.BytesVec,
  Byte32Vec: blockchain.Byte32Vec,
  BytesOpt: blockchain.BytesOpt,

  HashType: blockchain.HashType,
  DepType: blockchain.DepType,
}

/**
 * merge user tokens with primitive tokens
 * @param userTokens
 */
export const mergeBuiltinCodecs = (userCodecs: CodecMap): CodecMap => {
  return { ...builtinCodecs, ...userCodecs }
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
