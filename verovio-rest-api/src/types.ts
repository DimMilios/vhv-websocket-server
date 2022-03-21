import type { Response } from 'express';

export interface Subscriber {
  clientId?: number;
  docId?: number;
  res?: Response; 
}