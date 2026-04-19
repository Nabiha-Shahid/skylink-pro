import stripe
import os
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_checkout_session(flight_id: int, flight_number: str, amount: float, currency: str = "usd"):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': f'Flight {flight_number}',
                        },
                        'unit_amount': int(amount * 100), # Stripe expects amount in cents
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=f'http://localhost:3000/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'http://localhost:3000/cancel',
            metadata={
                "flight_id": flight_id,
            }
        )
        return checkout_session.url, checkout_session.id
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return None, None

def verify_payment(session_id: str):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == 'paid':
            return True, session.metadata
        return False, None
    except Exception as e:
        print(f"Error verifying payment: {e}")
        return False, None
