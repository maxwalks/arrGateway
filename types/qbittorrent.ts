export interface QbTorrent {
  hash: string;
  name: string;
  size: number;
  progress: number; // 0–1
  dlspeed: number; // bytes/s
  upspeed: number; // bytes/s
  eta: number; // seconds, 8640000 = unknown
  state: string; // downloading, uploading, stalledDL, pausedDL, error, etc.
  category: string;
  tags: string;
  num_seeds: number;
  num_leechs: number;
  added_on: number; // unix timestamp
  completion_on: number; // unix timestamp, -1 if not complete
  save_path: string;
  amount_left: number; // bytes remaining
}
