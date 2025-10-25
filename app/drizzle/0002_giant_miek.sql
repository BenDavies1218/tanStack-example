ALTER TABLE "assets" ALTER COLUMN "price_change_percentage_1h_in_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "price_change_percentage_7d_in_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "price_change_percentage_30d_in_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "price_change_percentage_1y_in_currency" DROP NOT NULL;