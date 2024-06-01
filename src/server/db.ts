import { getXataClient } from "~/libs/xata/xata";

const xata = getXataClient();

export const db = xata;
