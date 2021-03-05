const paymentObject = localStorage.getItem("payment");

const defaultStateShape = {
  keepUp: false,
  info: {
    email: "",
    fN: "",
    lN: "",
    aD: "",
    optional: "",
    city: "",
    country: "none",
    postal: ""
  },
  shippingType: "fs",
  shippingStage: false,
  paymentStage: false,
  paymentType: "card",
  currentStage: 0,
  billingAddress: "default",
  addBA: {
    fN: "",
    lN: "",
    aD: "",
    optional: "",
    city: "",
    country: "none",
    postal: ""
  }
};

/*
function execute(state, object) {
  const changedState = { ...state, ...object };
  localStorage.setItem("payment", JSON.stringify(changedState));
  return changedState();
}
*/

const defaultState = paymentObject ? JSON.parse(paymentObject) : defaultStateShape;

const paymentReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case "payment/keepUp":
      const newPayment = { ...state, keepUp: payload.value };
      localStorage.setItem("payment", JSON.stringify(newPayment));
      return newPayment;
    case "payment/changeInfo":
      const { email, fN, lN, aD, optional, city, country, postal } = payload;
      const updatedInfo = { ...state, info: { email, fN, lN, aD, optional, city, country, postal } };
      localStorage.setItem("payment", JSON.stringify(updatedInfo));
      return updatedInfo;
    case "payment/changeAdInfo":
      const { fN: fNAd, lN: lNAd, aD: aDAd, optional: optionalAd, city: cityAd, country: countryAd, postal: postalAd } = payload;
      const updatedAdInfo = { ...state, addBA: { fN: fNAd, lN: lNAd, aD: aDAd, optional: optionalAd, city: cityAd, country: countryAd, postal: postalAd } };
      localStorage.setItem("payment", JSON.stringify(updatedAdInfo));
      return updatedAdInfo;
    case "payment/changeStage":
      const { shippingStage, paymentStage } = payload;
      const changedStage = { ...state, shippingStage, paymentStage };
      localStorage.setItem("payment", JSON.stringify(changedStage));
      return changedStage;
    case "payment/changeCurrentStage":
      const changedCurrentStage = { ...state, currentStage: payload };
      localStorage.setItem("payment", JSON.stringify(changedCurrentStage));
      return changedCurrentStage;
    case "payment/changePayment":
      const updatedPayment = { ...state, paymentType: payload };
      localStorage.setItem("payment", JSON.stringify(updatedPayment));
      return updatedPayment;
    case "payment/changeShipping":
      const updatedShipping = { ...state, shippingType: payload };
      localStorage.setItem("payment", JSON.stringify(updatedShipping));
      return updatedShipping;
    case "payment/updatePayment":
      localStorage.removeItem("payment");
      return defaultStateShape;
    case "payment/changeBilling":
      const changedBilling = { ...state, billingAddress: payload };
      localStorage.setItem("payment", JSON.stringify(changedBilling));
      return changedBilling;
    default: return state;
  }
};

export default paymentReducer;