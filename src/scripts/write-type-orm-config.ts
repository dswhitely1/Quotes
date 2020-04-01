import { configService } from '../config/config.service';
import fs = require('fs');

const file = 'ormconfig.json';

try {
  fs.unlinkSync(file);
} catch (error) {
  console.log(`${file} not found.`);
}

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
