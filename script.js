document.addEventListener("DOMContentLoaded", function() {
    const payButton = document.getElementById("pay-button");
    
    payButton.addEventListener("click", function() {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        createPaymentSession(selectedPaymentMethod);
    });
});

function createPaymentSession(method) {
    fetch("/create-payment-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ method: method })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sessionId) {
            if (method === 'card') {
                Frames.init({
                    publicKey: "pk_sbox_ukfr4an7yqs5fn3ke6elg7dcte3",
                    paymentSessionId: data.sessionId
                });
                Frames.submitCard()
                    .then(function(response) {
                        processPayment(response.token, 'card');
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            } else if (method === 'sofort') {
                // Add Sofort integration code here
            }
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function processPayment(token, method) {
    const paymentData = {
        token: token,
        method: method
    };

    fetch("/pay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Payment successful!");
        } else {
            alert("Payment failed.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
