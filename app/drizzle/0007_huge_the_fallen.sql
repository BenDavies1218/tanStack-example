ALTER TABLE "assets" ALTER COLUMN "current_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "market_cap" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "total_volume" DROP NOT NULL;