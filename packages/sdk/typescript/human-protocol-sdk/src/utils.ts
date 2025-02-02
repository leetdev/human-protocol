/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers';

import {
  ContractExecutionError,
  EthereumError,
  InvalidArgumentError,
  NonceExpired,
  NumericFault,
  OutOfGasError,
  ReplacementUnderpriced,
  TransactionReplaced,
  UnpredictableGasLimit,
} from './error';

/**
 * **Get specific error text.*
 *
 * @param {any} error - An error message.
 * @returns
 */
export const getRevertReason = (error: any): string => {
  const prefix = "reverted with reason string '";
  const suffix = "'";
  const message = error.data.substring(
    error.data.indexOf(prefix) + prefix.length
  );
  return message.substring(0, message.indexOf(suffix));
};

/**
 * **Handle and throw the error.*
 *
 * @param {any} e
 * @returns
 */
export const throwError = (e: any) => {
  if (e.code === ethers.utils.Logger.errors.INVALID_ARGUMENT) {
    throw new InvalidArgumentError(e.message);
  } else if (e.code === 'OUT_OF_GAS') {
    throw new OutOfGasError(e.message);
  } else if (e.code === ethers.utils.Logger.errors.CALL_EXCEPTION) {
    const reason = getRevertReason(e.data);
    throw new ContractExecutionError(reason);
  } else if (e.code === ethers.utils.Logger.errors.UNPREDICTABLE_GAS_LIMIT) {
    throw new UnpredictableGasLimit(e.message);
  } else if (e.code === ethers.utils.Logger.errors.TRANSACTION_REPLACED) {
    throw new TransactionReplaced(e.message);
  } else if (e.code === ethers.utils.Logger.errors.REPLACEMENT_UNDERPRICED) {
    throw new ReplacementUnderpriced(e.message);
  } else if (e.code === ethers.utils.Logger.errors.NUMERIC_FAULT) {
    throw new NumericFault(e.message);
  } else if (e.code === ethers.utils.Logger.errors.NONCE_EXPIRED) {
    throw new NonceExpired(e.message);
  } else {
    throw new EthereumError(e.message);
  }
};

/**
 * **URL validation.*
 *
 * @param {string} url
 * @returns
 */
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
