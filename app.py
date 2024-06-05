from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    token = data['token']
    payment_method = data['paymentMethod']

    if payment_method == 'card':
        payment_data = {
            "source": {
                "type": "token",
                "token": token
            },
            "amount": 2000,
            "currency": "GBP",
            "reference": "T-shirt Purchase"
        }
    elif payment_method == 'sofort':
        payment_data = {
            "source": {
                "type": "sofort"
            },
            "amount": 2000,
            "currency": "EUR",
            "reference": "T-shirt Purchase",
            "description": "Payment for T-shirt"
        }

    headers = {
        'Authorization': 'sk_sbox_2wbc5v6l62ygbntp5gni6k5ypqz',
        'Content-Type': 'application/json'
    }
    response = requests.post('https://api.sandbox.checkout.com/payments-sessions', json=payment_data, headers=headers)

    if response.status_code == 201:
        return jsonify(success=True)
    else:
        return jsonify(success=False, error=response.json())

if __name__ == '__main__':
    app.run(debug=True)
