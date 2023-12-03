import { NextRequest } from 'next/server';
import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51J4h8nJh6g8gG9k5Yz8R7N0J3s8Ryq6z2Q7g2X2G6p0')
interface BodyType {
    unitAmmount: string;
    productId: string;
}
interface PriceRequest extends Request {
    unitAmmount: string;
    productId: string;
}
export async function GET(request: PriceRequest) {
    const body = await request.json()
    const { priceId, productId } = body
    const price = await stripe.prices.create({
        unit_ammount: Number(unitAmmount)
        currency: 'usd',
        priceId: priceId

    })
}
