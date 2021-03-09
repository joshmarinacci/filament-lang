#!/usr/bin/env node
import * as fs from 'fs';

const ohm = fs.readFileSync('src/filament.ohm')

const js = `export default String.raw\`${ohm}\``;

await fs.writeFileSync('src/filament.ohm.js', js)
