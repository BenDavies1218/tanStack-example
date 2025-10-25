ALTER TABLE "assets" ALTER COLUMN "price_change_24h" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "price_change_percentage_24h" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "price_change_percentage_24h_in_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "high_24h" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "low_24h" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "market_cap_change_24h" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "market_cap_change_percentage_24h" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "circulating_supply" DROP NOT NULL;