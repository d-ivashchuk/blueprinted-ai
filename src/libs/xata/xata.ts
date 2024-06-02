// Generated by Xata Codegen 0.29.5. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "blueprints",
    columns: [
      { name: "name", type: "string" },
      { name: "userId", type: "string" },
      { name: "isActive", type: "bool", defaultValue: "false" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Blueprints = InferredTypes["blueprints"];
export type BlueprintsRecord = Blueprints & XataRecord;

export type DatabaseSchema = {
  blueprints: BlueprintsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Dima-Ivashchuk-s-workspace-3t104m.us-east-1.xata.sh/db/blueprints",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
