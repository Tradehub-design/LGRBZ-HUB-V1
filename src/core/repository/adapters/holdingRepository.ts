export type Holding = {
  id: string;
  [key: string]: unknown;
};

export const holdingRepository = {
  list: async (): Promise<Holding[]> => [],
  get: async (_id: string): Promise<Holding | null> => null,
  save: async (holding: Holding): Promise<Holding> => holding,
};

export default holdingRepository;
