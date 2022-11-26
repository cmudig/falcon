import { bin, binTime, numBins } from "../util";
import { Dimension } from "./dimension";
import type { Interval } from "../basic";
import { BinConfig } from "../api";

export function createBinConfig(
  dimension: Dimension,
  extent: Interval<number>
) {
  const time = false;
  const binningFunc = time ? binTime : bin;
  return binningFunc(dimension.bins, extent);
}

export function readableBins(binConfig: BinConfig) {
  let bins: { binStart: number; binEnd: number }[] = [];
  let curStart = binConfig.start;
  let curEnd = curStart + binConfig.step;
  while (curEnd <= binConfig.stop) {
    bins.push({ binStart: curStart, binEnd: curEnd });
    curStart = curEnd;
    curEnd += binConfig.step;
  }
  return bins;
}

export function conciseBins(binConfig: BinConfig) {
  const n = numBins(binConfig);
  const bins = new Float32Array(n);
  let curStart = binConfig.start;
  for (let i = 0; i < n; i++) {
    bins[i] = curStart;
    curStart += binConfig.step;
  }
  return bins;
}
