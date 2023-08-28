// eslint-disable-next-line import/no-extraneous-dependencies
import { Pool } from 'pg';
const connectionString = 'postgres://rskqwruroewvaf:6a9a4f9777482d65a1b3af10c99c3c36c7ee4a3ea50c60a781588823b174b22a@ec2-52-45-200-167.compute-1.amazonaws.com:5432/d9kpo8hr9jr9v7';

export const pool = new Pool({
  connectionString,
});
