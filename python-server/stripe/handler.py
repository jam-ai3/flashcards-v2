import stripe
import dotenv
import os


dotenv.load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def verify_stripe_connection():

    try:
        stripe.Account.retrieve()
    except:
        print("Stripe connection failed")
        return False
    return True


if __name__ == "__main__":
    print(verify_stripe_connection())
