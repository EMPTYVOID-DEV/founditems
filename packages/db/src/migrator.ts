import postgres from 'postgres';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';

function runMigrations() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const migrationsFolder = join(__dirname, '../drizzle');
	const client = postgres(process.env['DATABASE_URL']!);
	const db = drizzle(client);
	return migrate(db, { migrationsFolder });
}

runMigrations()
	.then(() => {
		console.log('Migrations completed successfully');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Error running migrations:', error);
		process.exit(1);
	});
