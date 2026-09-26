import 'dotenv/config';
import dns from 'node:dns';
import mongo from '@prisma/orm-mongo/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };
import { MongoClient } from "mongodb";

const configuredDnsServers = process.env['MONGODB_DNS_SERVERS']
  ?.split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (configuredDnsServers?.length) {
  dns.setServers(configuredDnsServers);
}

export const client = new MongoClient(process.env["DATABASE_URL"]!);
export const db = mongo<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});
